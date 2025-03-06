import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { LoginResponse, UserWithRolePermissions } from 'src/types/user.type';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { HttpException } from '@nestjs/common';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserTokenTypeEnum } from '../../../enums/user.enum';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordWithOtpDto } from './dto/reset-password-with-otp.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.MockedObject<Partial<AuthService>>;

  let mockUser = {
    name: 'testUser',
    email: 'testEmail@gmail.com',
    password: 'somerandomtestpassword',
  } as User;

  let mockLoginDto: LoginUserDto = {
    email: 'testEmail@gmail.com',
    password: 'somerandomtestpassword',
  };

  const mockRequest = { user: mockUser, get: jest.fn(), replace: jest.fn() } as unknown as Request;

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      forgotPassword: jest.fn(),
      forgotPasswordWithOtp: jest.fn(),
      setOrResetPassword: jest.fn(),
      resetPasswordWithOtp: jest.fn(),
      logout: jest.fn(),
      refreshTokens: jest.fn(),
      me: jest.fn(),
      verifyOtp: jest.fn(),
    } as jest.MockedObject<Partial<AuthService>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Should be able to define AuthController', () => {
    expect(controller).toBeDefined();
  });

  describe('Register User', () => {
    it('Should be able to register a user', async () => {
      const createUserResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_CREATED };
      mockAuthService.register.mockResolvedValue(createUserResponse);
      const response: ResponseData<MessageResponse> = await controller.register(mockUser);

      expect(response).toStrictEqual(createUserResponse);
    });

    it('Should return conflict response for already existing user', async () => {
      const conflictResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.EMAIL_OR_KEY_EXISTS };
      mockAuthService.register.mockResolvedValue(conflictResponse);
      const response: ResponseData<MessageResponse> = await controller.register(mockUser);

      expect(response).toStrictEqual(conflictResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.register.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.register(mockUser)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.register.mockRejectedValue(new Exception('exception'));
      expect(controller.register(mockUser)).rejects.toThrow(Exception);
    });
  });

  describe('Login User', () => {
    it('Should be able to login a user', async () => {
      const loginResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.OTP_SEND_SUCCESSFULLY };
      mockAuthService.login.mockResolvedValue(loginResponse);
      const response: MessageResponse | LoginResponse = await controller.login(mockLoginDto);

      expect(response).toStrictEqual(loginResponse);
    });

    it('Should return bad response for invalid credential', async () => {
      const invalidCredResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.INVALID_CREDENTIAL };
      mockAuthService.login.mockResolvedValue(invalidCredResponse);
      const response: MessageResponse | LoginResponse = await controller.login(mockLoginDto);

      expect(response).toStrictEqual(invalidCredResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.login.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.login(mockLoginDto)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.login.mockRejectedValue(new Exception('exception'));
      expect(controller.login(mockLoginDto)).rejects.toThrow(Exception);
    });
  });

  describe('Me', () => {
    it('Should return the loggedIn user', async () => {
      const userWithPermissions: UserWithRolePermissions = {
        ...mockUser,
        permissions: [],
        userRolePermissions: [],
      } as UserWithRolePermissions;
      mockAuthService.me.mockResolvedValue(userWithPermissions);
      const response: ResponseData<User> = await controller.me(mockRequest);

      expect(response).toStrictEqual(userWithPermissions);
    });

    it('Should throw HttpException for unhandled exception', () => {
      mockAuthService.me.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.me(mockRequest)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.me.mockRejectedValue(new Exception('exception'));
      expect(controller.me(mockRequest)).rejects.toThrow(Exception);
    });
  });

  describe('Logout User', () => {
    it('Should logout the user', async () => {
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.LOGOUT_SUCCESSFUL,
      };
      mockAuthService.logout.mockResolvedValue(expectedResponse);
      const response: ResponseData<MessageResponse> = await controller.logout(mockRequest);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should throw HttpException for unhandled exceptions', async () => {
      mockAuthService.logout.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.logout(mockRequest)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.logout.mockRejectedValue(new Exception('exception'));
      expect(controller.logout(mockRequest)).rejects.toThrow(Exception);
    });
  });

  describe('Refresh Token', () => {
    let mockUser = {
      id: 1,
      name: 'testUser',
      email: 'testEmail@gmail.com',
      password: 'testPassword',
    } as User;

    it('Should refresh the user tokens', async () => {
      const expectedResponse: LoginResponse = {
        id: mockUser?.id,
        email: mockUser?.email,
        access_token: 'jwt-token',
        refresh_token: 'jwt-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(expectedResponse);
      const response: ResponseData<LoginResponse> = await controller.refreshToken(mockRequest);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should throw HttpException for unhandled exceptions', async () => {
      mockAuthService.refreshTokens.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.refreshToken(mockRequest)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.refreshTokens.mockRejectedValue(new Exception('exception'));
      expect(controller.refreshToken(mockRequest)).rejects.toThrow(Exception);
    });
  });

  describe('Forgot Password', () => {
    it('Should send password reset email', async () => {
      const forgotPasswordResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.RESET_EMAIL_SENT };
      mockAuthService.forgotPassword.mockResolvedValue(forgotPasswordResponse);
      const response: ResponseData<MessageResponse> = await controller.forgotPassword({ email: mockUser.email });

      expect(response).toStrictEqual(forgotPasswordResponse);
    });

    it('Should return bad response for invalid Email', async () => {
      const invalidEmailResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.INVALID_EMAIL };
      mockAuthService.forgotPassword.mockResolvedValue(invalidEmailResponse);
      const response: ResponseData<MessageResponse> = await controller.forgotPassword({ email: mockUser.email });

      expect(response).toStrictEqual(invalidEmailResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.forgotPassword.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.forgotPassword({ email: mockUser?.email })).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.forgotPassword.mockRejectedValue(new Exception('exception'));
      expect(controller.forgotPassword({ email: mockUser?.email })).rejects.toThrow(Exception);
    });
  });

  describe('Reset Password', () => {
    it('Should reset the user password', async () => {
      const resetPasswordResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.PASSWORD_RESET };
      mockAuthService.setOrResetPassword.mockResolvedValue(resetPasswordResponse);
      const response: ResponseData<MessageResponse> = await controller.resetPassword({ token: '', password: '' });

      expect(response).toStrictEqual(resetPasswordResponse);
    });

    it('Should return bad response for invalid token', async () => {
      const invalidTokenResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.INVALID_TOKEN };
      mockAuthService.setOrResetPassword.mockResolvedValue(invalidTokenResponse);
      const response: ResponseData<MessageResponse> = await controller.resetPassword({ token: '', password: '' });

      expect(response).toStrictEqual(invalidTokenResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.setOrResetPassword.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.resetPassword).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.setOrResetPassword.mockRejectedValue(new Exception('exception'));
      expect(controller.resetPassword({ token: '', password: '' })).rejects.toThrow(Exception);
    });
  });

  describe('Verify Otp', () => {
    const mockVerifyOtpDto = {
      email: 'test@gmail.com',
      otp: '0000',
    } as VerifyOtpDto;

    it('Should verify the user', async (): Promise<void> => {
      const expectedResponse: ResponseData<LoginResponse> = {
        id: 1,
        email: 'test@gmail.com',
        access_token: 'sample-token',
        refresh_token: 'refresh-token',
      };

      mockAuthService.verifyOtp.mockResolvedValue(expectedResponse);
      const response: ResponseData<LoginResponse> = await controller.verifyOtp(UserTokenTypeEnum?.LOGIN_OTP, mockVerifyOtpDto);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.verifyOtp.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.verifyOtp).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.verifyOtp.mockRejectedValue(new Exception('exception'));
      expect(controller.verifyOtp(UserTokenTypeEnum?.LOGIN_OTP, mockVerifyOtpDto)).rejects.toThrow(Exception);
    });
  });

  describe('Forgot Password Otp', () => {
    const mockForgotPasswordDto = {
      email: 'test@gmail.com',
    } as ForgotPasswordDTO;

    it('Should send password reset email', async (): Promise<void> => {
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.RESET_EMAIL_SENT };
      mockAuthService.forgotPasswordWithOtp.mockResolvedValue(expectedResponse);

      const response: MessageResponse = await controller.forgotPasswordWithOtp(mockForgotPasswordDto);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.forgotPasswordWithOtp.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.forgotPasswordWithOtp).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.forgotPasswordWithOtp.mockRejectedValue(new Exception('exception'));
      expect(controller.forgotPasswordWithOtp(mockForgotPasswordDto)).rejects.toThrow(Exception);
    });
  });

  describe('Reset Password Otp', () => {
    const mockResetPasswordWithOtpDto = {
      email: 'test@gmail.com',
      password: '',
      otp: '0000',
    } as ResetPasswordWithOtpDto;

    it('Should reset the password successfuly', async (): Promise<void> => {
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.PASSWORD_RESET };
      mockAuthService.resetPasswordWithOtp.mockResolvedValue(expectedResponse);

      const response: MessageResponse = await controller.resetPasswordWithOtp(mockResetPasswordWithOtpDto);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should handle the exceptions', () => {
      mockAuthService.resetPasswordWithOtp.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.resetPasswordWithOtp).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', () => {
      mockAuthService.resetPasswordWithOtp.mockRejectedValue(new Exception('exception'));
      expect(controller.resetPasswordWithOtp(mockResetPasswordWithOtpDto)).rejects.toThrow(Exception);
    });
  });
});
