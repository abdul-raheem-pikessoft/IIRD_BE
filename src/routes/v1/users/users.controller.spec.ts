import { Test, TestingModule } from '@nestjs/testing';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
import { Mocked } from 'src/types/test.type';
import { ListingResponseData, MessageResponse, ResponseData } from 'src/types/response.type';
import { HttpException } from '@nestjs/common';
import { Request } from 'express';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: Mocked<UserService>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'password',
    isActive: true,
  } as User;

  const mockRequest = { user: mockUser } as unknown as Request;

  beforeEach(async () => {
    mockUserService = {
      create: jest.fn(),
      createWithSocialId: jest.fn(),
      findAll: jest.fn(),
      findOneByProperties: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      verifyEmail: jest.fn(),
      findUserWithExcludedProperties: jest.fn(),
      findOneWithPermissions: jest.fn(),
      generateOTP: jest.fn(),
    } as Mocked<UserService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User creation', () => {
    it('Should create a new user', async () => {
      const createResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_CREATED };
      mockUserService.create.mockResolvedValue(createResponse);
      const response: ResponseData<MessageResponse> = await controller.create(mockUser);

      expect(response).toStrictEqual(createResponse);
    });

    it('Should throw ConflictResponse if user already exists', async () => {
      const createResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.EMAIL_OR_KEY_EXISTS };
      mockUserService.create.mockResolvedValue(createResponse);
      const response: ResponseData<MessageResponse> = await controller.create(mockUser);

      expect(response).toStrictEqual(createResponse);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.create.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.create(mockUser)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exceptions', async () => {
      mockUserService.create.mockRejectedValue(new Exception('exception'));
      expect(controller.create(mockUser)).rejects.toThrow(Exception);
    });
  });

  describe('Find all users', () => {
    it('Should find all users', async () => {
      const mockUsers: ListingResponseData<User> = { count: [mockUser].length, records: [mockUser] };
      mockUserService.findAll.mockResolvedValue(mockUsers);
      const response: ListingResponseData<User> = await controller.findAll();

      expect(response).toStrictEqual(mockUsers);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.findAll.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.findAll).rejects.toThrow(HttpException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.findAll.mockRejectedValue(new Exception('unhandled exception'));
      expect(controller.findAll()).rejects.toThrow(Exception);
    });
  });

  describe('Find a user by id', () => {
    it('Should find a user by id', async () => {
      mockUserService.findOneByProperties.mockResolvedValue(mockUser);
      const response: ResponseData<User> = await controller.findOne(mockRequest, mockUser.id);

      expect(response).toStrictEqual(mockUser);
    });

    it('Should return NotFound when no user if found', async () => {
      mockUserService.findOneByProperties.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.USER_NOT_FOUND));
      expect(controller.findOne(mockRequest, mockUser.id)).rejects.toThrow(Exception);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.findOneByProperties.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.findOne).rejects.toThrow(HttpException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.findOneByProperties.mockRejectedValue(new Exception('unhandled exception'));
      expect(controller.findOne(mockRequest, mockUser?.id)).rejects.toThrow(Exception);
    });
  });

  describe('Update user', () => {
    it('Should update a user', async () => {
      const updateResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.USER_UPDATED };
      mockUserService.update.mockResolvedValue(updateResponse);
      const response: ResponseData<User> = await controller.update(mockRequest, 1, mockUser);

      expect(response).toStrictEqual(updateResponse);
    });

    it('Should return NotFound when no user if found', async () => {
      mockUserService.update.mockRejectedValue(new NotFoundException(ExceptionMessageConstant?.USER_NOT_FOUND));
      expect(controller.update(mockRequest, mockUser.id, mockUser)).rejects.toThrow(Exception);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.update.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.update).rejects.toThrow(HttpException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.update.mockRejectedValue(new Exception('unhandled exception'));
      expect(controller.update(mockRequest, 1, mockUser)).rejects.toThrow(Exception);
    });
  });

  describe('Remove user', () => {
    it('Should remove a user', async () => {
      const deleteResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant?.USER_REMOVED };
      mockUserService.remove.mockResolvedValue(deleteResponse);
      const response: ResponseData<MessageResponse> = await controller.remove(1);

      expect(response).toStrictEqual(deleteResponse);
    });

    it('Should return NotFound when no user if found', async () => {
      const deleteResponse: ResponseData<MessageResponse> = { message: ExceptionMessageConstant.USER_NOT_FOUND };
      mockUserService.remove.mockResolvedValue(deleteResponse);
      const response: ResponseData<MessageResponse> = await controller.remove(1);

      expect(response).toStrictEqual(deleteResponse);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.remove.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(controller.remove).rejects.toThrow(HttpException);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserService.remove.mockRejectedValue(new Exception('unhandled exception'));
      expect(controller.remove(1)).rejects.toThrow(Exception);
    });
  });

  describe('Verify Email', (): void => {
    it('Should verify the user email', async (): Promise<void> => {
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant?.USER_VERIFIED };
      mockUserService.verifyEmail.mockResolvedValue(expectedResponse);

      const response: MessageResponse = await controller.verifyEmail(mockUser?.email);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should throw HttpException for unhandled exceptions', async () => {
      mockUserService.verifyEmail.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.verifyEmail(mockUser?.email)).rejects.toThrow(HttpException);
    });

    it('Should throw HttpException for unhandled exceptions', async () => {
      mockUserService.verifyEmail.mockRejectedValue(new Exception('unhandled exception'));

      expect(controller.verifyEmail(mockUser?.email)).rejects.toThrow(Exception);
    });
  });
});
