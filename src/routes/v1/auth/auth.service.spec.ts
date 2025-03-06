import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache, Store } from 'cache-manager';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { Mocked } from 'src/types/test.type';
import { LoginResponse, Tokens, UserWithRolePermissions } from 'src/types/user.type';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { UserTokenTypeEnum } from '../../../enums/user.enum';
import { ForbiddenException, NotFoundException, UnauthorizedException, UnhandledException } from '../../../exceptions/custom-exception';
import { AppHelperService } from '../../../helpers/app.helper';
import { UserToken } from '../user-tokens/entities/user-tokens.entity';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { AuthService } from './auth.service';
import { ResetPasswordWithOtpDto } from './dto/reset-password-with-otp.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { TokensDto } from './dto/tokens.dto';
import { UserMailer } from '../../../mailer/services/user-mailer.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: Mocked<UserService>;
  let mockJWTService: Mocked<JwtService>;
  let mockUserTokenService: Mocked<UserTokensService>;
  let mockUserMailService: Mocked<UserMailer>;
  const mockUser: User = {
    name: 'testUser',
    email: 'testEmail@gmail.com',
    password: '123',
    isTwoFactorAuth: false,
  } as User;
  let mockToken: Partial<UserToken>;
  let mockCacheManager: Mocked<Cache<Mocked<Store>>>;
  const methodNames = Object.getOwnPropertyNames(AuthService.prototype);
  let spyAuthService: any = {};
  const mockRefreshToken =
    'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhYmR1bC5tYXR0ZWVAcGlrZXNzb2Z0LmNvbSIsImlhdCI6MTY5NDc2MzAyMCwiZXhwIjoxNjk1MDIyMjIwfQ.JQtjyCo-oE6SfsIBO4RP8hnPt4Xuw66C7GjHB6lZwWy8E-o-ITVqn4nhJXaukjFm-CYxYLUuh_faYZLH563PnhiULWVGP6opq2jHRgLFU4WuiQy1aqU-9Di4vk276Eh1Snoh5ST0o-9O3whL-d8mQc91E1v7rycuZ7yzKh6coGCW6MzFip5JcXwQeBS1spvYymO2aJEY3wSoLXhI2oEFp8jojPu2QtWfmUre2D25fUlXNqVGSlTehAH2q07ZNeAAuKDGojZ2HXJMaLv0dRMFJFubzK1oQjnXvuwjkXh7GJJ8pD4_LKxxa0Ejx7EtY9nyd6jGUHk7udqIwUBOqZvU7Q';
  const mockedVerifyPasswordHelper = jest.fn();
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 15);
  const mockGenerateTokenHelper: jest.Mock = jest.fn();

  beforeEach(async () => {
    mockCacheManager = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn(),
      store: {
        ttl: jest.fn(),
      },
    } as Mocked<Cache<Mocked<Store>>>;

    mockToken = {
      id: 1,
      token: '6fad7e7e0217637d07cdb853edbb0358',
      user: { id: 40 } as User,
      expiresAt: expiration,
    } as UserToken;

    mockUserService = {
      create: jest.fn(),
      update: jest.fn(),
      findOneByProperties: jest.fn(),
      findUserWithExcludedProperties: jest.fn(),
      createWithSocialId: jest.fn(),
      findAll: jest.fn(),
      remove: jest.fn(),
      verifyEmail: jest.fn(),
      setStoragePreference: jest.fn(),
      generateOTP: jest.fn(),
      findOneWithPermissions: jest.fn(),
      findOne: jest.fn(),
    } as Mocked<UserService>;

    mockUserTokenService = {
      storeToken: jest.fn(),
      findToken: jest.fn(),
      removeTokenById: jest.fn(),
      softRemoveTokensByUserId: jest.fn(),
      deleteAllUserTokens: jest.fn(),
      storeOtp: jest.fn(),
      verifyOtpInResetPassword: jest.fn(),
      removeTokenByType: jest.fn(),
      verifyOtp: jest.fn(),
      removeUserToken: jest.fn(),
      storeTokenArray: jest.fn(),
      deleteTokensByUuid: jest.fn(),
      verifyToken: jest.fn(),
    } as Mocked<UserTokensService>;

    mockJWTService = {
      signAsync: jest.fn().mockResolvedValue(mockRefreshToken),
    } as Mocked<JwtService>;

    mockUserMailService = {
      forgotPasswordWithOTP: jest.fn(),
      forgotPassword: jest.fn(),
      setPassword: jest.fn(),
      twoFactorAuthentication: jest.fn(),
      unblockUser: jest.fn(),
      userRegister: jest.fn(),
    } as Mocked<UserMailer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJWTService,
        },
        {
          provide: UserTokensService,
          useValue: mockUserTokenService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: UserMailer,
          useValue: mockUserMailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    methodNames.forEach((method) => {
      spyAuthService[method] = jest.spyOn(service as any, method);
    });

    AppHelperService.verifyPassword = mockedVerifyPasswordHelper;
    AppHelperService.generateToken = mockGenerateTokenHelper;
  });

  it('Should be able to define AuthService', () => {
    expect(service).toBeDefined();
  });

  describe('Set User Password', () => {
    it('Should set the user password', async () => {
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant.SET_PASSWORD_EMAIL_SENT };
      mockGenerateTokenHelper.mockReturnValue({ token: '1234' });

      const response: ResponseData<MessageResponse> = await (service as any).setUserPassword(mockUser);

      expect(response).toStrictEqual(expectedResponse);
      expect(mockGenerateTokenHelper).toHaveBeenCalled();
    });

    it('Should be able to handle exceptions', async () => {
      mockUserTokenService.storeToken.mockRejectedValue({ message: '' });

      expect((service as any).setUserPassword(mockUser)).rejects.toThrow(UnhandledException);
    });
  });

  describe('User Creation', () => {
    it('Should successfully register a user', async () => {
      const registerResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_CREATED };
      mockUserService.create.mockResolvedValue(registerResponse);
      const response: ResponseData<MessageResponse> = await service.register(mockUser);

      expect(response).toStrictEqual(registerResponse);
    });

    it('Should return error for an existing user', async () => {
      const rejectedResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.EMAIL_OR_KEY_EXISTS };
      mockUserService.create.mockResolvedValue(rejectedResponse);
      const response: ResponseData<MessageResponse> = await service.register(mockUser);

      expect(response).toBe(rejectedResponse);
    });

    it('Should throw an Unhandled Exception in case of Exception', (): void => {
      mockUserService.create.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.register(mockUser)).rejects.toThrow(UnhandledException);
    });
  });

  describe('User Login', () => {
    it('Should email an otp for correct email and password if otp enabled', async () => {
      mockUserService.findOne.mockResolvedValue({
        ...mockUser,
        password: '$2a$10$PbW4QmbnE51GTy2f0DcWyuSNbPgJr7qsWI57pGQR81.R6FnR7So5q',
      });
      spyAuthService.validateLoginCredentials.mockResolvedValue(true);
      mockUserService.generateOTP.mockResolvedValue('1234');

      const response: MessageResponse | LoginResponse = await service.login(mockUser);
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant.OTP_SEND_SUCCESSFULLY };

      expect(response).toStrictEqual(expectedResponse);
      expect(spyAuthService.validateLoginCredentials).toHaveBeenCalled();
    });

    it('Should return auth tokens if otp is not enabled', async () => {
      process.env.OTP_FOR_LOGIN = 'false';
      mockUserService.findOne.mockResolvedValue(mockUser);
      spyAuthService.validateLoginCredentials.mockResolvedValue(true);
      jest.spyOn(service, 'getTokens').mockResolvedValue({ accessToken: mockRefreshToken, refreshToken: mockRefreshToken });

      const response: LoginResponse | MessageResponse = await service.login(mockUser);
      const expectedResponse: LoginResponse | MessageResponse = {
        id: mockUser?.id,
        email: mockUser?.email,
        access_token: mockRefreshToken,
        refresh_token: mockRefreshToken,
      };

      expect(response).toStrictEqual(expectedResponse);
      expect(spyAuthService.validateLoginCredentials).toHaveBeenCalled();
    });

    it('Should send email to set password if user has social account linked but logins with password', async () => {
      mockUserService.findOne.mockResolvedValue({ ...mockUser, password: '' });
      spyAuthService.validateLoginCredentials.mockResolvedValue(true);

      await service.login(mockUser);

      expect(spyAuthService.setUserPassword).toHaveBeenCalled();
    });

    it('Should create user when the user logins with social account', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      spyAuthService.validateLoginCredentials.mockResolvedValue(true);

      await service.login({ socialId: '1234', email: mockUser?.email });

      expect(mockUserService.createWithSocialId).toHaveBeenCalled();
    });

    it('Should throw Unauthorized Exception for invalid credentials', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);
      spyAuthService.validateLoginCredentials.mockRejectedValue(new UnauthorizedException(ExceptionMessageConstant.INVALID_CREDENTIAL));

      expect(service.login(mockUser)).rejects.toThrow(UnauthorizedException);
    });

    it('Should throw Unauthorized Exception if no user found for password login', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      expect(service.login({ email: mockUser?.email, password: mockUser?.email })).rejects.toThrow(UnauthorizedException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.findOne.mockRejectedValue({ message: '' });

      expect(service.login(mockUser)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Update refresh token', () => {
    it("Should update the user's token", async () => {
      const response: TokensDto = await service.getTokens(1, mockUser.email);

      expect(response.accessToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
    });

    it('Should be able to handle exceptions', async () => {
      expect(service.updateRefreshToken).rejects.toThrow(UnhandledException);
    });
  });

  describe('User logout', () => {
    it('Should logout the current user', async () => {
      const logoutResponse: MessageResponse = { message: ResponseMessageConstant.LOGOUT_SUCCESSFUL };
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      const response: ResponseData<MessageResponse> = await service.logout();

      expect(response).toStrictEqual(logoutResponse);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserTokenService.findToken.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.logout()).rejects.toThrow(UnhandledException);
    });
  });

  describe('me', () => {
    it('Should return user with permissions', async (): Promise<void> => {
      const expectedResponse: UserWithRolePermissions = { ...mockUser, permissions: [], userRolePermissions: [] };
      mockUserService.findOneWithPermissions.mockResolvedValue(expectedResponse);

      const response: ResponseData<UserWithRolePermissions> = await service.me(mockUser);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', (): void => {
      mockUserService.findOneWithPermissions.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.me(mockUser)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get tokens', () => {
    it('Should generate and return refresh & access token', async () => {
      mockJWTService.signAsync.mockResolvedValue(mockRefreshToken);
      const response: ResponseData<Tokens> = await service.getTokens(mockUser?.id, mockUser?.email, '0');
      const expectedResponse: Tokens = { accessToken: mockRefreshToken, refreshToken: mockRefreshToken };

      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('Refresh tokens', () => {
    it("Should refresh the user's token", async () => {
      const refreshTokenResponse: LoginResponse = {
        id: mockUser.id,
        email: mockUser.email,
        access_token: mockRefreshToken,
        refresh_token: mockRefreshToken,
      };
      mockUserService.findOneByProperties.mockResolvedValue({ ...mockUser });
      const response: ResponseData<LoginResponse> = await service.refreshTokens(mockUser.id);

      expect(response).toStrictEqual(refreshTokenResponse);
    });

    it('Should return NotFound if not user found against the given id', async () => {
      mockUserService.findOneByProperties.mockRejectedValue(new NotFoundException(ExceptionMessageConstant.USER_NOT_FOUND));
      expect(service.refreshTokens(mockUser?.id)).rejects.toThrow(NotFoundException);
    });

    it('Should return NotFound if hashedToken and provided token do not match', async () => {
      mockUserService.findOneByProperties.mockRejectedValue(new UnhandledException(ExceptionMessageConstant?.NOT_FOUND));
      expect(service.refreshTokens(mockUser?.id)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Forgot Password', () => {
    it('Should send an email with reset password link', async () => {
      const emailSentResponse: MessageResponse = { message: ResponseMessageConstant.RESET_EMAIL_SENT };
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      const response: ResponseData<MessageResponse> = await service.forgotPassword(mockUser.email);

      expect(response).toStrictEqual(emailSentResponse);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.findOneByProperties.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.forgotPassword).rejects.toThrow(UnhandledException);
    });
  });

  describe('Forgot Password with Otp', (): void => {
    it('Should send an email with otp', async (): Promise<void> => {
      spyAuthService.checkValidity.mockResolvedValue(0);
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      mockUserService.generateOTP.mockResolvedValue('1234');
      const response: ResponseData<MessageResponse> = await service.forgotPasswordWithOtp(mockUser?.email);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.RESET_EMAIL_SENT,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should throw Forbidden Exception if token limit reached', async (): Promise<void> => {
      const responseMessage: string = 'Too many attempts, please try again in 10 minutes';
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      spyAuthService.checkValidity.mockRejectedValue(new ForbiddenException(responseMessage));

      await expect(service.forgotPasswordWithOtp(mockUser?.email)).rejects.toThrow(ForbiddenException);
      expect(spyAuthService.checkValidity).toHaveBeenCalled();
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      spyAuthService.checkValidity.mockRejectedValue({ message: '' });

      await expect(service.forgotPasswordWithOtp(mockUser?.email)).rejects.toThrow(UnhandledException);
      expect(spyAuthService.checkValidity).toHaveBeenCalled();
    });
  });

  describe('Reset Password', (): void => {
    const mockResetPasswordDto = {
      token: '6fad7e7e0217637d07cdb853edbb0358',
      password: 'testPassword',
    } as ResetPasswordDTO;

    it('should reset the user password', async (): Promise<void> => {
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant?.PASSWORD_RESET };

      mockUserTokenService.verifyToken.mockResolvedValue(mockToken as UserToken);
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      mockUserService.update.mockResolvedValue({ message: ResponseMessageConstant?.USER_UPDATED });
      mockUserTokenService.removeTokenByType.mockResolvedValue({ message: ResponseMessageConstant?.TOKEN_REMOVED });

      const response: ResponseData<MessageResponse> = await service.setOrResetPassword(
        mockResetPasswordDto,
        UserTokenTypeEnum.FORGOT_PASSWORD_TOKEN,
      );

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should handle the exceptions ', (): void => {
      mockUserTokenService.verifyToken.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.setOrResetPassword).rejects.toThrow(UnhandledException);
    });
  });

  describe('Reset Password with Otp', () => {
    const body: ResetPasswordWithOtpDto = {
      email: mockUser?.email,
      otp: '1234',
      password: mockUser?.password,
    };

    it('Should reset the user password', async () => {
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      mockUserTokenService.verifyOtpInResetPassword.mockResolvedValue({ message: ResponseMessageConstant.OTP_VERIFIED });
      const response: ResponseData<MessageResponse> = await service.resetPasswordWithOtp(body);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.PASSWORD_RESET,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should throw NotFound Exception if user not found', () => {
      mockUserService.findOneByProperties.mockRejectedValue(new NotFoundException(ExceptionMessageConstant.USER_NOT_FOUND));
      expect(service.resetPasswordWithOtp(body)).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', () => {
      mockUserService.findOneByProperties.mockRejectedValue({ message: '' });
      expect(service.resetPasswordWithOtp(body)).rejects.toThrow(UnhandledException);
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a password reset token with an expiration date', () => {
      const response = service.generatePasswordResetToken();

      expect(response).toHaveProperty('token');
      expect(response.token).toHaveLength(32);
      expect(response).toHaveProperty('expiresAt');
      expect(response.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('generatePasswordResetOtp', () => {
    it('should generate a password reset OTP with an expiration date', () => {
      const response = service.generatePasswordResetOtp();

      expect(response).toHaveProperty('otp');
      expect(response.otp).toHaveLength(4);
      expect(response).toHaveProperty('expiresAt');
      expect(response.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('Validate Login Credentials', () => {
    const body: LoginUserDto = {
      email: mockUser?.email,
      password: mockUser?.password,
    };

    it('Should return if login credentials are valid', async () => {
      mockUser.isActive = true;
      spyAuthService.checkValidity.mockReturnThis();
      mockedVerifyPasswordHelper.mockReturnValue(true);
      const response: boolean = await (service as any).validateLoginCredentials(body, mockUser);

      expect(response).toBeUndefined();
      expect(spyAuthService.checkValidity).toHaveBeenCalled();
    });

    it('Should throw UnAuthorized Exception if credentials are invalid', async () => {
      mockUser.isActive = true;
      spyAuthService.checkValidity.mockReturnThis();
      mockedVerifyPasswordHelper.mockReturnValue(false);

      expect((service as any).validateLoginCredentials(body, mockUser)).rejects.toThrowError(UnauthorizedException);
      expect(spyAuthService.checkValidity).toHaveBeenCalled();
    });

    it('Should throw UnAuthorized Exception if user is not active', async () => {
      expect((service as any).validateLoginCredentials(body, { ...mockUser, isActive: false })).rejects.toThrowError(UnauthorizedException);
    });

    it('Should be able to handle exceptions', async () => {
      spyAuthService.checkValidity.mockRejectedValue({ message: '' });
      expect((service as any).validateLoginCredentials('', body, mockUser)).rejects.toThrowError(UnhandledException);
    });

    it('Should return UnAuthorized if credentials are invalid', async () => {
      expect((service as any).validateLoginCredentials({ email: 'test@example.com', password: '123' }, mockUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('Verify Otp', () => {
    it('should verify OTP successfully for login', async () => {
      mockUserService.findUserWithExcludedProperties.mockResolvedValue(mockUser);
      mockUserService.generateOTP.mockResolvedValueOnce('123456');
      jest.spyOn(service, 'getTokens').mockResolvedValue({ accessToken: mockRefreshToken, refreshToken: mockRefreshToken });

      const response: ResponseData<LoginResponse> = await service.verifyOtp(
        {
          email: 'example@example.com',
          otp: '123456',
        },
        UserTokenTypeEnum?.LOGIN_OTP,
      );

      expect(response).toEqual({
        id: mockUser?.id,
        email: mockUser?.email,
        access_token: mockRefreshToken,
        refresh_token: mockRefreshToken,
      });
    });

    it('should verify OTP successfully for password reset', async () => {
      mockUserService.findUserWithExcludedProperties.mockResolvedValueOnce(mockUser);
      mockUserTokenService.verifyOtp.mockResolvedValueOnce(mockToken as UserToken);

      const response: ResponseData<LoginResponse> = await service.verifyOtp(
        {
          email: 'example@example.com',
          otp: '123456',
        },
        UserTokenTypeEnum?.FORGOT_PASSWORD_OTP,
      );

      expect(response).toEqual({ message: ResponseMessageConstant?.OTP_VERIFIED });
    });

    it('Should be able to handle exceptions', async () => {
      spyAuthService.checkValidity.mockRejectedValue({ message: '' });
      expect(service.verifyOtp).rejects.toThrowError(UnhandledException);
    });
  });
});
