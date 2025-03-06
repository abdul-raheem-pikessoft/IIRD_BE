import { Test, TestingModule } from '@nestjs/testing';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { User } from '../users/entities/user.entity';
import { UserToken } from './entities/user-tokens.entity';
import { UserTokenRepository } from './user-tokens.repository';
import { UserTokensService } from './user-tokens.service';
import { UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { UserTokenTypeEnum } from '../../../enums/user.enum';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

describe('UserTokensService', () => {
  let service: UserTokensService;
  let mockRepository: jest.MockedObject<Partial<UserTokenRepository>>;
  let spyUserTokenService: any = {};
  const expiration: Date = new Date();
  expiration.setMinutes(expiration.getMinutes() + 30);
  const methodNames: string[] = Object.getOwnPropertyNames(UserTokensService.prototype);
  let mockToken: Partial<UserToken> = {
    id: 1,
    token: '6fad7e7e0217637d07cdb853edbb0358',
    user: { id: 40 } as User,
    expiresAt: expiration,
  };

  beforeEach(async () => {
    mockRepository = {
      findOneByProp: jest.fn(),
      findAllByUserId: jest.fn(),
      createToken: jest.fn(),
      saveToken: jest.fn(),
      softRemoveOneBy: jest.fn(),
      softRemoveAllBy: jest.fn(),
      deleteAll: jest.fn(),
      createOtp: jest.fn(),
      saveOtp: jest.fn(),
      remove: jest.fn(),
      findOne: jest.fn(),
      saveUserTokens: jest.fn(),
      removeUserToken: jest.fn(),
      removeByUuid: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTokensService,
        {
          provide: UserTokenRepository,
          useValue: mockRepository,
        }
      ],
    }).compile();

    service = module.get<UserTokensService>(UserTokensService);
    methodNames.forEach((method: string) => {
      spyUserTokenService[method] = jest.spyOn(service as any, method);
    });
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Find Token', () => {
    it('Should be able to find a token', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValue(mockToken as UserToken);
      const response: UserToken = await service.findToken({ token: mockToken.token });

      expect(response).toStrictEqual(mockToken);
    });

    it('Should return null if no token found', async (): Promise<void> => {
      const response: UserToken = await service.findToken({ token: mockToken.token });

      expect(response).toStrictEqual(undefined);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue({ message: '' });

      expect(service.storeToken).rejects.toThrow(UnhandledException);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.storeToken).rejects.toThrow(UnhandledException);
    });
  });

  describe('Store Token', () => {
    it('Should be able to store a token', async (): Promise<void> => {
      mockRepository.saveUserTokens.mockResolvedValue([mockToken] as UserToken[]);
      spyUserTokenService.findToken.mockResolvedValue(mockToken as UserToken);
      const response: ResponseData<UserToken[]> = await service.storeToken({
        token: mockToken.token,
        expiresAt: mockToken.expiresAt,
        user: mockToken.user,
      });

      expect(response).toStrictEqual([mockToken]);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue({ message: '' });

      expect(service.storeToken).rejects.toThrow(UnhandledException);
    });
  });

  describe('Remove Token', () => {
    it('Should be able to remove a token by Id', async (): Promise<void> => {
      const removeTokenResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.TOKEN_REMOVED };
      const response: ResponseData<MessageResponse> = await service.removeTokenById(mockToken.id);

      expect(response).toStrictEqual(removeTokenResponse);
    });

    it('Should be able to remove all tokens of a user', async (): Promise<void> => {
      const removeTokenResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.TOKEN_REMOVED };
      const response: MessageResponse = await service.softRemoveTokensByUserId({ id: 1 } as User);

      expect(response).toStrictEqual(removeTokenResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOneByProp.mockRejectedValue({ message: '' });

      expect(service.removeUserToken).rejects.toThrow(UnhandledException);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOneByProp.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.removeUserToken).rejects.toThrow(UnhandledException);
    });
  });

  describe('Remove Token by Type', () => {
    it('Should remove all user tokens by userId', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValue(mockToken as UserToken);
      const response: ResponseData<MessageResponse> = await service.removeTokenByType(mockToken.token, mockToken?.type);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.TOKEN_REMOVED,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue({ message: '' });
      expect(service.removeTokenByType).rejects.toThrow(UnhandledException);
    });
  });

  it('Should remove all user tokens by userId', async (): Promise<void> => {
    const response: ResponseData<MessageResponse> = await service.deleteAllUserTokens(mockToken?.userId);
    const expectedResponse: ResponseData<MessageResponse> = {
      message: ResponseMessageConstant.TOKEN_REMOVED,
    };

    expect(response).toStrictEqual(expectedResponse);
  });

  it('Should be able to handle exceptions', async (): Promise<void> => {
    mockRepository.findAllByUserId.mockRejectedValue({ message: '' });
    mockRepository.deleteAll.mockRejectedValue({ message: '' });
    expect(service.deleteAllUserTokens).rejects.toThrow(UnhandledException);
  });

  describe('Remove By Uuid', (): void => {
    it('Should remove all user tokens by uuid', async (): Promise<void> => {
      const response: ResponseData<MessageResponse> = await service.deleteTokensByUuid(mockToken?.uuid);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.TOKEN_REMOVED,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.removeByUuid.mockRejectedValue({ message: '' });
      expect(service.deleteTokensByUuid).rejects.toThrow(UnhandledException);
    });
  });

  describe('Verify Otp', () => {
    it('Should return otp if the otp is valid', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValue(mockToken as UserToken);
      spyUserTokenService.removeUserToken.mockReturnThis();
      const response: ResponseData<UserToken> = await service.verifyOtp(
        mockToken?.userId,
        mockToken?.otp,
        UserTokenTypeEnum.LOGIN_OTP,
        '1',
      );

      expect(response).toStrictEqual(mockToken);
    });

    it('Should throw BadRequest Exception & increase the invalid otp attempts for invalid otp', async () => {
      spyUserTokenService.setInvalidOtpAttempts.mockRejectedValue(new UnhandledException(ExceptionMessageConstant.INVALID_OTP));

      expect(service.verifyOtp(mockToken?.userId, mockToken?.otp, UserTokenTypeEnum.LOGIN_OTP, '1')).rejects.toThrow(UnhandledException);
    });

    it('Should throw BadRequest Exception & delete otp for expired otp', async () => {
      const expectedResponse: UserToken = { ...mockToken, expiresAt: new Date('1999-11-28 20:20:20') } as UserToken;

      mockRepository.findOne.mockResolvedValue(expectedResponse);
      spyUserTokenService.removeUserToken.mockReturnThis();
      spyUserTokenService.setInvalidOtpAttempts.mockRejectedValue(new UnhandledException(ExceptionMessageConstant.INVALID_OTP));

      expect(service.verifyOtp(mockToken?.userId, mockToken?.otp, UserTokenTypeEnum.LOGIN_OTP, '1')).rejects.toThrow(UnhandledException);
    });

    it('Should be able to handle exceptions', () => {
      mockRepository.findOne.mockRejectedValue({ message: '' });

      expect(service.verifyOtp(mockToken?.userId, mockToken?.otp, UserTokenTypeEnum.LOGIN_OTP, '1')).rejects.toThrow(UnhandledException);
    });
  });

  describe('Verify User Token', () => {
    it('Should return the token if valid', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValue(mockToken as UserToken);

      const response: ResponseData<UserToken> = await service.verifyToken(mockToken.token, mockToken.type);
      const expectedResponse: ResponseData<UserToken> = mockToken as UserToken;

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should return BadResponse if token is invalid', async (): Promise<void> => {
      const expectedResponse: UserToken = { ...mockToken, expiresAt: new Date('1999-11-28 20:20:20') } as UserToken;
      mockRepository.findOne.mockResolvedValue(expectedResponse);

      expect(service.verifyToken(mockToken.token, mockToken.type)).rejects.toThrow(UnhandledException);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue({ message: '' });

      expect(service.verifyToken).rejects.toThrow(UnhandledException);
    });
  });

  describe('Remove By User Id', () => {
    it('Should remove all user tokens by userId', async (): Promise<void> => {
      const response: ResponseData<MessageResponse> = await service.deleteAllUserTokens(mockToken?.userId);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.TOKEN_REMOVED,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.deleteAll.mockRejectedValue({ message: '' });

      expect(service.deleteAllUserTokens).rejects.toThrow(UnhandledException);
    });
  });

  describe('Store User Token Array', (): void => {
    it('Should store the user token array', async (): Promise<void> => {
      mockRepository.saveUserTokens.mockResolvedValue([mockToken] as UserToken[]);

      const response: ResponseData<UserToken[]> = await service.storeTokenArray([mockToken]);
      const expectedResponse: ResponseData<UserToken[]> = [mockToken] as UserToken[];

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue({ message: '' });

      expect(service.storeTokenArray).rejects.toThrow(UnhandledException);
    });
  });

  describe('Verify Otp In Reset Password', () => {
    const userId = 1;
    const otp = '0000';

    it('Should return success message if OTP is valid and not expired', async (): Promise<void> => {
      const mockUserOtp: UserToken = {
        userId,
        token: otp,
        expiresAt: new Date(new Date().getTime() + 60000),
        type: UserTokenTypeEnum.FORGOT_PASSWORD_OTP,
      } as UserToken;

      const expectedResponse: MessageResponse = { message: ResponseMessageConstant?.OTP_VERIFIED };

      mockRepository.findOne.mockResolvedValue(mockUserOtp);
      const currentTime: Date = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => currentTime);

      const response: MessageResponse = await service.verifyOtpInResetPassword(userId, otp);

      expect(response).toEqual(expectedResponse);
    });

    it('Should throw Unhandled Exception if OTP is invalid', async (): Promise<void> => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyOtpInResetPassword(userId, otp)).rejects.toThrow(UnhandledException);
    });

    it('Should throw UnhandledException if an unexpected error occurs', async (): Promise<void> => {
      mockRepository.findOne.mockRejectedValue(new UnhandledException('unhandled exception'));

      await expect(service.verifyOtpInResetPassword(userId, otp)).rejects.toThrow(UnhandledException);
    });
  });
});
