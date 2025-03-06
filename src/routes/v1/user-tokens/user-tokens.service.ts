import { BadRequestException, Inject, Injectable, HttpStatus } from '@nestjs/common';
import { UserTokenRepository } from './user-tokens.repository';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { UserToken } from './entities/user-tokens.entity';
import { User } from '../users/entities/user.entity';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { EntityManager } from 'typeorm';
import { FindTokenType } from '../../../types/global.types';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { UserTokenTypeEnum } from '../../../enums/user.enum';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

@Injectable()
export class UserTokensService {
  constructor(private readonly userTokenRepo: UserTokenRepository) {}

  async findToken(newToken: Partial<UserToken>): Promise<UserToken> {
    try {
      return await this.userTokenRepo.findOne(newToken);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async storeToken(newToken: Partial<UserToken>, transactionManager?: EntityManager): Promise<UserToken[]> {
    try {
      const { userId, type, key }: FindTokenType = newToken as FindTokenType;
      const existingToken: UserToken = await this.findToken({ userId, type, key });
      const userToken: UserToken = { ...existingToken, ...newToken } as UserToken;

      return await this.userTokenRepo.saveUserTokens([userToken], transactionManager);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }
  async verifyOtpInResetPassword(userId: number, otp: string): Promise<ResponseData<MessageResponse>> {
    try {
      const userOtp: UserToken = await this.userTokenRepo.findOne({
        userId,
        token: otp,
        type: UserTokenTypeEnum.FORGOT_PASSWORD_OTP,
      });

      const currentTime: Date = new Date();

      if (!userOtp || currentTime > userOtp?.expiresAt) {
        this.removeTokenByType(userOtp?.token, UserTokenTypeEnum?.FORGOT_PASSWORD_OTP);
        throw new BadRequestException(ExceptionMessageConstant?.INVALID_OTP);
      }

      await this.removeUserToken({ userId, type: UserTokenTypeEnum.FORGOT_PASSWORD_OTP });

      return { message: ResponseMessageConstant.OTP_VERIFIED };
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async removeTokenById(tokenId: number): Promise<ResponseData<MessageResponse>> {
    try {
      const token: UserToken = await this.userTokenRepo.findOneByProp({ id: tokenId });
      await this.userTokenRepo.softRemoveOneBy(token);

      return { message: ResponseMessageConstant.TOKEN_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async softRemoveTokensByUserId(user: User): Promise<ResponseData<MessageResponse>> {
    try {
      const tokens: UserToken[] = await this.userTokenRepo.findAllByUserId(user.id);
      await this.userTokenRepo.softRemoveAllBy(tokens);

      return { message: ResponseMessageConstant.TOKEN_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async deleteAllUserTokens(id: number): Promise<MessageResponse> {
    try {
      const tokens: UserToken[] = await this.userTokenRepo.findAllByUserId(id);
      await this.userTokenRepo.deleteAll(tokens);

      return { message: ResponseMessageConstant.TOKEN_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async verifyOtp(userId: number, otp: string, type: UserTokenTypeEnum, key: string): Promise<ResponseData<UserToken>> {
    try {
      const userOtp: UserToken = await this.userTokenRepo.findOne({ userId, token: otp, type });
      const currentTime: Date = new Date();


      if (currentTime > userOtp?.expiresAt) {
        await this.removeUserToken({ userId, type });
      }
      return userOtp;
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
  async removeUserToken(userToken: Partial<UserToken>): Promise<ResponseData<MessageResponse>> {
    try {
      const userTokens: UserToken = await this.userTokenRepo.findOne(userToken);
      await this.userTokenRepo.removeUserToken([userTokens]);

      return { message: ResponseMessageConstant?.TOKEN_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async storeTokenArray(newTokens: Partial<UserToken>[], transactionManager?: EntityManager): Promise<UserToken[]> {
    try {
      return await this.userTokenRepo.saveUserTokens(newTokens as Partial<UserToken[]>, transactionManager);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async deleteTokensByUuid(uuid: string, transactionManager?: EntityManager): Promise<ResponseData<MessageResponse>> {
    try {
      await this.userTokenRepo.removeByUuid(uuid, transactionManager);

      return { message: ResponseMessageConstant?.TOKEN_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }

  async verifyToken(token: string, type: UserTokenTypeEnum): Promise<ResponseData<UserToken>> {
    try {
      const userToken: UserToken = await this.userTokenRepo.findOne({ token, type });
      const currentTime: Date = new Date();

      if (!userToken || currentTime > userToken?.expiresAt) {
        await this.removeTokenByType(token, UserTokenTypeEnum?.FORGOT_PASSWORD_TOKEN);
        throw new BadRequestException(ExceptionMessageConstant?.TOKEN_INVALID);
      }

      return userToken;
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async removeTokenByType(token: string, type: UserTokenTypeEnum): Promise<ResponseData<MessageResponse>> {
    try {
      const userToken: UserToken = await this.userTokenRepo.findOne({ token, type });
      if (userToken) {
        await this.userTokenRepo.removeUserToken([userToken]);
      }

      return { message: ResponseMessageConstant?.TOKEN_REMOVED };
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }
}
