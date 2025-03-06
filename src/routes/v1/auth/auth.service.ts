import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { randomBytes } from 'crypto';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { LoginResponse, Tokens, UserWithRolePermissions } from 'src/types/user.type';
import { v4 as uuidv4 } from 'uuid';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { UserTokenTypeEnum } from '../../../enums/user.enum';
import {
  Exception,
  NotFoundException,
  UnauthorizedException,
  UnhandledException,
} from '../../../exceptions/custom-exception';
import { AppHelperService } from '../../../helpers/app.helper';
import { UserMailer } from '../../../mailer/services/user-mailer.service';
import { OtpAndExpiry, TokenAndExpiry } from '../../../types/global.types';
import { UserToken } from '../user-tokens/entities/user-tokens.entity';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { ResetPasswordWithOtpDto } from './dto/reset-password-with-otp.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { TokensDto } from './dto/tokens.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private userTokenService: UserTokensService,
    private userMailer: UserMailer,
  ) {}

  private async setUserPassword(user: User): Promise<MessageResponse> {
    try {
      const { token, expiresAt }: TokenAndExpiry = AppHelperService.generateToken(+process.env.SET_PASSWORD_TOKEN_EXPIRY);

      await this.userTokenService.storeToken({
        token,
        type: UserTokenTypeEnum.SET_PASSWORD,
        userId: user?.id,
        expiresAt,
      });

      await this.userMailer.setPassword(user, `${process.env.SET_PASSWORD_URL}/${token}`);

      return { message: ResponseMessageConstant.SET_PASSWORD_EMAIL_SENT };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async login(body: LoginUserDto): Promise<MessageResponse | LoginResponse> {
    try {
      let existingUser: User = await this.userService.findOne({
        email: body?.email,
      });

      if (existingUser) {
        await this.validateLoginCredentials(body, existingUser);

        if (body?.password && !existingUser?.password) {
          return await this.setUserPassword(existingUser);
        }
      } else if (body?.socialId) {
        existingUser = await this.userService.createWithSocialId(body);
      } else {
        throw new NotFoundException(ExceptionMessageConstant?.INVALID_CREDENTIAL);
      }

      if (existingUser?.isTwoFactorAuth && !body?.socialId) {
        const otpValue: string = await this.userService.generateOTP(existingUser, UserTokenTypeEnum?.LOGIN_OTP);
        await this.userMailer.twoFactorAuthentication({ ...existingUser }, otpValue);

        return { message: ResponseMessageConstant?.OTP_SEND_SUCCESSFULLY };
      }

      const uuid: string = uuidv4();
      const tokens: Tokens = await this.getTokens(existingUser?.id, existingUser?.email, uuid);
      await this.updateRefreshToken(existingUser?.id, tokens?.refreshToken, tokens?.accessToken, uuid);

      return {
        id: existingUser?.id,
        email: existingUser?.email,
        access_token: tokens?.accessToken,
        refresh_token: tokens?.refreshToken,
      };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      if (err instanceof NotFoundException) {
        throw new UnauthorizedException(ExceptionMessageConstant?.INVALID_CREDENTIAL);
      }

      throw err;
    }
  }

  async verifyOtp(body: VerifyOtpDto, type: UserTokenTypeEnum): Promise<ResponseData<LoginResponse>> {
    try {
      const uuid: string = uuidv4();
      const response: ResponseData<User> = await this.userService.findUserWithExcludedProperties({ email: body?.email });
      const existingUser: User = response as User;
      const key: string = `${existingUser?.id}-${type}-invalid-otp-attempts`;
      await this.userTokenService.verifyOtp(existingUser?.id, body?.otp, type, key);

      if (type === UserTokenTypeEnum.LOGIN_OTP) {
        await this.userTokenService.removeUserToken({ userId: existingUser?.id, type });
        const token: Tokens = await this.getTokens(existingUser?.id, existingUser?.email, uuid);
        await this.updateRefreshToken(existingUser?.id, token?.refreshToken, token?.accessToken, uuid);

        return {
          id: existingUser?.id,
          email: existingUser?.email,
          access_token: token?.accessToken,
          refresh_token: token?.refreshToken,
        };
      }

      return { message: ResponseMessageConstant?.OTP_VERIFIED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async register(body: CreateUserDto): Promise<ResponseData<MessageResponse>> {
    try {
      return await this.userService.create(body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }
      throw err;
    }
  }

  async me(user: User): Promise<ResponseData<UserWithRolePermissions>> {
    try {
      return await this.userService.findOneWithPermissions(user);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
    accessToken: string = null,
    uuid: string = null,
  ): Promise<ResponseData<UserToken[]>> {
    try {
      const hashedRefreshToken: string = bcryptjs.hashSync(refreshToken);

      const userTokens: Partial<UserToken>[] = [
        {
          userId,
          token: refreshToken,
          uuid,
          type: UserTokenTypeEnum?.REFRESH_TOKEN,
        },
        {
          userId,
          token: accessToken,
          uuid,
          type: UserTokenTypeEnum?.ACCESS_TOKEN,
        },
        {
          userId,
          token: hashedRefreshToken,
          uuid,
          type: UserTokenTypeEnum?.HASHED_REFRESH_TOKEN,
        },
      ];

      return await this.userTokenService.storeTokenArray(userTokens);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async getTokens(userId: number, email: string, uuid: string = null): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
          email,
          uuid,
        },
        {
          privateKey: process.env.PRIVATE_KEY,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRE_DURATION,
          algorithm: 'RS512',
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
          email,
          uuid,
        },
        {
          privateKey: process.env.JWT_REFRESH_PRIVATE,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRE_DURATION,
          algorithm: 'RS512',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(token: string = null): Promise<ResponseData<MessageResponse>> {
    try {
      const userToken: UserToken = await this.userTokenService.findToken({ token });
      await this.userTokenService.deleteTokensByUuid(userToken?.uuid);

      return { message: ResponseMessageConstant.LOGOUT_SUCCESSFUL };
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async refreshTokens(id: number): Promise<ResponseData<LoginResponse>> {
    try {
      const response: ResponseData<User> = await this.userService.findOneByProperties({ id });
      const user = response as User;
      const tokens: Tokens = await this.getTokens(user?.id, user?.email);

      await this.updateRefreshToken(user?.id, tokens?.refreshToken, tokens?.accessToken, uuidv4());

      return {
        id: user?.id,
        email: user?.email,
        access_token: tokens?.accessToken,
        refresh_token: tokens?.refreshToken,
      };
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  generatePasswordResetToken() {
    const token = randomBytes(16).toString('hex');

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + +process.env.RESET_PASSWORD_LINK_EXPIRY);

    return {
      token,
      expiresAt: expiration,
    };
  }

  generatePasswordResetOtp(): OtpAndExpiry {
    const otp: string = (Math.floor(Math.random() * 9000) + 1000).toString();

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + +process.env.RESET_PASSWORD_LINK_EXPIRY);

    return {
      otp,
      expiresAt: expiration,
    };
  }

  async forgotPassword(email: string): Promise<ResponseData<MessageResponse>> {
    try {
      const response: ResponseData<User> = await this.userService.findOneByProperties({ email });
      const existingUser: User = response as User;
      const key: string = `${existingUser?.id}-forgot-password-token-attempts`;

      const { token, expiresAt }: TokenAndExpiry = AppHelperService.generateToken(+process.env.RESET_PASSWORD_LINK_EXPIRY);
      const userToken: UserToken = {
        userId: existingUser?.id,
        token,
        expiresAt,
        type: UserTokenTypeEnum?.FORGOT_PASSWORD_TOKEN,
      } as UserToken;

      await this.userTokenService.storeToken(userToken);
      const resetLink: string = `${process.env.BASE_FE_LINK}/reset-password/${token}`;
      await this.userMailer.forgotPassword({ email }, resetLink);

      return { message: ResponseMessageConstant.RESET_EMAIL_SENT };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async forgotPasswordWithOtp(email: string): Promise<ResponseData<MessageResponse>> {
    try {
      const response: ResponseData<User> = await this.userService.findOneByProperties({ email });
      const existingUser: User = response as User;
      const key: string = `${existingUser?.id}-forgot-password-otp-attempts`;

      const otp: string = await this.userService.generateOTP(
        existingUser as UserWithRolePermissions,
        UserTokenTypeEnum?.FORGOT_PASSWORD_OTP,
      );

      await this.userMailer.forgotPasswordWithOTP({ email }, otp);

      return { message: ResponseMessageConstant?.RESET_EMAIL_SENT };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async setOrResetPassword(props: ResetPasswordDTO, tokenType: UserTokenTypeEnum): Promise<MessageResponse> {
    try {
      const response: ResponseData<UserToken> = await this.userTokenService.verifyToken(props.token, tokenType);
      const storedToken: UserToken = response as UserToken;
      const user: User = (await this.userService.findOneByProperties({ id: storedToken?.userId })) as User;

      user.password = props?.password;
      user.salt = user?.salt || AppHelperService.generateSalt();
      await this.userService.update(user?.id, { ...user } as User);
      await this.userTokenService.removeTokenByType(props.token, tokenType);

      const message: string =
        tokenType === UserTokenTypeEnum.FORGOT_PASSWORD_TOKEN
          ? ResponseMessageConstant?.PASSWORD_RESET
          : ResponseMessageConstant?.SET_PASSWORD;

      return { message };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async resetPasswordWithOtp(body: ResetPasswordWithOtpDto): Promise<ResponseData<MessageResponse>> {
    try {
      const { email, otp, password }: ResetPasswordWithOtpDto = body;
      const response: ResponseData<User> = await this.userService.findOneByProperties({ email });
      const user: User = response as User;

      await this.userTokenService.verifyOtpInResetPassword(user.id, otp);
      await this.userService.update(user?.id, { password });

      return { message: ResponseMessageConstant.PASSWORD_RESET };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  private async validateLoginCredentials(body: LoginUserDto, existingUser: User): Promise<void> {
    try {
      let validPassword;
      let validSocialId;
      if (!existingUser?.isActive) {
        throw new UnauthorizedException(ExceptionMessageConstant.USER_IS_NOT_ACTIVE);
      }

      if (body?.password && existingUser?.password) {
        validPassword = AppHelperService.verifyPassword(body?.password, existingUser?.password, existingUser?.salt);
      }

      const socialProvider: string = `${body?.socialProvider}SocialId`;

      if (body?.socialId && !existingUser?.[socialProvider]) {
        await this.userService.update(existingUser?.id, { [socialProvider]: body?.socialId });
      }

      if (body?.socialId && existingUser?.[socialProvider]) {
        validSocialId = body?.socialId === existingUser?.[socialProvider];
      }
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
}
