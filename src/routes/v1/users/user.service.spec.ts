import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { UserRolePermissionService } from '../user-role-permission/user-role-permission.service';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { DuplicateException, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { Mocked } from 'src/types/test.type';
import { CreateUserDto } from './dto/create-user.dto';
import { ListingResponseData, MessageResponse, ResponseData } from 'src/types/response.type';
import { UserWithRolePermissions } from 'src/types/user.type';
import { AppHelperService } from '../../../helpers/app.helper';
import { UserToken } from '../user-tokens/entities/user-tokens.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { UserMailer } from '../../../mailer/services/user-mailer.service';

describe('UsersService', () => {
  let mockUserRepository: Mocked<UserRepository>;
  let mockUserTokenService: Mocked<UserTokensService>;
  let mockUserRolePermissionService: Mocked<UserRolePermissionService>;
  let mockUserMailerService: Mocked<UserMailer>;
  let service: UserService;
  let mockUsers: User[] = [];
  const mockExtractRoleAndPermissionHelper: jest.Mock = jest.fn();
  const mockVerifyPermissionsHelper: jest.Mock = jest.fn();

  const mockUser = {
    id: 1,
    name: 'Test User',
    isActive: true,
    email: 'test@example.com',
    password: 'password',
    userRolePermission: [],
  } as User;

  const mockToken = {
    id: 1,
    token: 'abc',
    expiresAt: new Date('2023-11-28 20:20:20'),
    userId: mockUser?.id,
  } as UserToken;

  beforeEach(async () => {
    mockUserRepository = {
      createUser: jest.fn(),
      saveUser: jest.fn(),
      findOneByProp: jest.fn(),
      findAll: jest.fn(),
      deleteBy: jest.fn(),
      findOneWithExcludedProperties: jest.fn(),
    } as Mocked<UserRepository>;

    mockUserTokenService = {
      softRemoveTokensByUserId: jest.fn(),
      deleteAllUserTokens: jest.fn(),
      removeTokenById: jest.fn(),
      findToken: jest.fn(),
      storeToken: jest.fn(),
      verifyOtpInResetPassword: jest.fn(),
    } as Mocked<UserTokensService>;

    mockUserRolePermissionService = {
      updateUserRoles: jest.fn(),
      assignRoles: jest.fn(),
      assignPermissions: jest.fn(),
    } as Mocked<UserRolePermissionService>;

    mockUserMailerService = {
      forgotPasswordWithOTP: jest.fn(),
      forgotPassword: jest.fn(),
      setPassword: jest.fn(),
      twoFactorAuthentication: jest.fn(),
      unblockUser: jest.fn(),
      userRegister: jest.fn(),
    } as Mocked<UserMailer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: UserTokensService,
          useValue: mockUserTokenService,
        },
        {
          provide: UserRolePermissionService,
          useValue: mockUserRolePermissionService,
        },
        {
          provide: UserMailer,
          useValue: mockUserMailerService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    AppHelperService.extractRolesPermissionFromUser = mockExtractRoleAndPermissionHelper;
    AppHelperService.verifyPermissions = mockVerifyPermissionsHelper;
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User creation', () => {
    const body: CreateUserDto = {
      ...mockUser,
      roles: [1],
      permissions: [1],
    };

    it('Should create a user with roles', async () => {
      mockUserRepository.saveUser.mockResolvedValue(mockUser);
      const response: ResponseData<MessageResponse> = await service.create(body);
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_CREATED };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should throw DuplicateException if email already exists', () => {
      mockUserRepository.saveUser.mockRejectedValue({ message: ExceptionMessageConstant.DUPLICATE });
      expect(service.create(body)).rejects.toThrow(DuplicateException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRepository.saveUser.mockRejectedValue(Error);
      expect(service.create(body)).rejects.toStrictEqual(Error);
    });
  });

  describe('Create user with Social Id', () => {
    it('Should create a user with social id', async () => {
      mockUserRepository.saveUser.mockResolvedValue(mockUser);
      const response: User = await service.createWithSocialId(mockUser);

      expect(response).toStrictEqual(mockUser);
    });

    it('Should be throw Duplicate Exception in case of exception', async () => {
      mockUserRepository.saveUser.mockRejectedValue(new DuplicateException(ExceptionMessageConstant?.DUPLICATE));
      expect(service.createWithSocialId(mockUser)).rejects.toThrow(DuplicateException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRepository.saveUser.mockRejectedValue({ message: '' });
      expect(service.createWithSocialId(mockUser)).rejects.toThrow(HttpException);
    });
  });

  describe('Get User(ME)', () => {
    it('Should retrieve user', async () => {
      const id = 1;
      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockVerifyPermissionsHelper.mockResolvedValue(true);
      const response: ResponseData<User> = await service.findOneByProperties({ id });

      expect(response).toStrictEqual(mockUser);
    });

    it('Should return NotFound when user is not found', async () => {
      expect(service.findUserWithExcludedProperties({ name: mockUser?.name })).rejects.toThrow(NotFoundException);
    });
  });

  describe('Find all users', () => {
    beforeEach(() => {
      mockUsers = [mockUser, { ...mockUser, name: 'testing1', isActive: false }, { ...mockUser, name: 'testing2' }];
    });
    it('Should find all users', async () => {
      mockUserRepository.findAll.mockResolvedValue([mockUsers, mockUsers.length]);
      const response: ListingResponseData<User> = await service.findAll();

      const expectedResponse: ListingResponseData<User> = {
        count: mockUsers?.length,
        records: mockUsers?.map((user) => ({ ...user, permissions: [] })),
      };
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRepository.findAll.mockRejectedValue({ message: '' });
      expect(service.findAll).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find user by id', () => {
    it('Should find a user by id', async () => {
      const id = 1;
      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockVerifyPermissionsHelper.mockResolvedValue(true);
      const response: ResponseData<User> = await service.findOneByProperties({ id });

      expect(response).toStrictEqual(mockUser);
    });

    it('Should return NotFound when user is not found', async () => {
      expect(service.findOneByProperties({ id: mockUser?.id })).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRepository.findOneByProp.mockRejectedValue({ message: '' });
      expect(service.findOneByProperties).rejects.toThrow(UnhandledException);
    });
  });

  describe('Update user', () => {
    const mockUpdateUserDto = {
      id: 1,
      name: 'Test User',
      isActive: true,
      email: 'test@example.com',
      password: 'password',
      socialId: 'test-socialId',
      userRolePermission: [],
      isTwoFactorAuth: true
    } as UpdateUserDto;

    it('Should update a user', async () => {
      const id = 1;
      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockUserRepository.saveUser.mockResolvedValue(mockUser);
      mockVerifyPermissionsHelper.mockResolvedValue(true);
      const response: ResponseData<MessageResponse> = await service.update(id, mockUpdateUserDto as User);
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_UPDATED };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should update the user roles', async () => {
      const id = 1;
      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockUserRepository.saveUser.mockResolvedValue(mockUser);
      mockVerifyPermissionsHelper.mockResolvedValue(true);
      const response: ResponseData<MessageResponse> = await service.update(id, { newRoles: [1, 2], deleteRoles: [3] });
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_UPDATED };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should return NotFound when user is not found', async () => {
      expect(service.update(1, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRepository.findOneByProp.mockRejectedValue({ message: '' });
      expect(service.update).rejects.toThrow(UnhandledException);
    });
  });

  describe('Remove user', () => {
    it('Should remove a user', async () => {
      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockUserTokenService.deleteAllUserTokens.mockResolvedValue({ message: ResponseMessageConstant?.TOKEN_REMOVED });
      mockUserRepository.deleteBy.mockResolvedValue({
        affected: 1,
        raw: {},
      });
      const response: ResponseData<MessageResponse> = await service.remove(1);
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_REMOVED };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should return NotFound when user is not found', async () => {
      expect(service.remove(mockUser?.id)).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRepository.findOneByProp.mockRejectedValue({ message: '' });
      expect(service.remove).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find One With Permissions', () => {
    it('Should return user with permissions and roles', async () => {
      const expectedResponse: UserWithRolePermissions = { ...mockUser, permissions: [], userRolePermissions: [] };

      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockExtractRoleAndPermissionHelper.mockReturnValue(expectedResponse);

      const response: ResponseData<User> = await service.findOneWithPermissions({ id: mockUser?.id });

      expect(response).toStrictEqual(expectedResponse);
      expect(mockExtractRoleAndPermissionHelper).toHaveBeenCalled();
    });

    it('Should throw NotFound Exception if user not found', async () => {
      expect(service.findOneWithPermissions({ name: mockUser?.name })).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', () => {
      mockUserRepository.findOneByProp.mockRejectedValue({ message: '' });

      expect(service.findOneWithPermissions({ name: mockUser?.name })).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find User With Excluded Properties', () => {
    it('Should retrieve user by any user property', async () => {
      mockUserRepository.findOneWithExcludedProperties.mockResolvedValue(mockUser);

      const response: ResponseData<User> = await service.findUserWithExcludedProperties({ id: mockUser?.id });

      expect(response).toStrictEqual(mockUser);
    });

    it('Should throw NotFound Exception if user not found', async () => {
      expect(service.findUserWithExcludedProperties({ name: mockUser?.name })).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', () => {
      mockUserRepository.findOneWithExcludedProperties.mockRejectedValue({ message: '' });

      expect(service.findUserWithExcludedProperties({ name: mockUser?.name })).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find One By Properties', () => {
    it('Should retrieve user by any user property', async () => {
      mockUserRepository.findOneByProp.mockResolvedValue(mockUser);
      mockVerifyPermissionsHelper.mockResolvedValue(true);

      const response: ResponseData<User> = await service.findOneByProperties({ id: mockUser?.id });

      expect(response).toStrictEqual(mockUser);
    });

    it('Should throw NotFound Exception if user not found', async () => {
      expect(service.findOneByProperties({ name: mockUser?.name })).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', () => {
      mockUserRepository.findOneByProp.mockRejectedValue({ message: '' });

      expect(service.findOneByProperties({ name: mockUser?.name })).rejects.toThrow(UnhandledException);
    });
  });

  describe('Verify Email', () => {
    it('Should activate a user', async () => {
      const spyFindOne: jest.SpyInstance = jest.spyOn(service, 'findOneByProperties').mockResolvedValue(mockUser);

      const response: ResponseData<MessageResponse> = await service.verifyEmail(mockUser?.email);
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_VERIFIED };

      expect(response).toStrictEqual(expectedResponse);
      expect(spyFindOne).toHaveBeenCalled();
    });

    it('Should throw NotFound Exception if user not found', async () => {
      const spyFindOne: jest.SpyInstance = jest
        .spyOn(service, 'findOneByProperties')
        .mockRejectedValue(new NotFoundException(ExceptionMessageConstant.USER_NOT_FOUND));

      expect(service.verifyEmail(mockUser?.email)).rejects.toThrow(NotFoundException);
      expect(spyFindOne).toHaveBeenCalled();
    });

    it('Should be able to handle exceptions', async () => {
      const spyFindOne: jest.SpyInstance = jest.spyOn(service, 'findOneByProperties').mockResolvedValue(mockUser);
      mockUserRepository.saveUser.mockRejectedValue({ message: '' });

      expect(service.verifyEmail(mockUser?.email)).rejects.toThrow(UnhandledException);
      expect(spyFindOne).toHaveBeenCalled();
    });
  });

  describe('Generate OTP', () => {
    it('Should store and return an OTP', async () => {
      const response: string = await service.generateOTP(mockUser, mockToken?.type);

      expect(response).toStrictEqual('0000');
    });

    it('Should be able to handle exceptions', () => {
      mockUserTokenService.storeToken.mockRejectedValue({ message: '' });

      expect(service.generateOTP(mockUser, mockToken?.type)).rejects.toThrow(UnhandledException);
    });
  });
});
