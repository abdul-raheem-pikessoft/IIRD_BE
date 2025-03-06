import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { Role } from './entities/roles.entity';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { HttpException } from '@nestjs/common';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

describe('Roles Controller', () => {
  let controller: RoleController;
  let mockRoleService: jest.MockedObject<Partial<RoleService>>;

  const mockRole: Role = {
    id: 1,
    name: 'test role',
  } as Role;

  beforeEach(async () => {
    mockRoleService = {
      createRole: jest.fn(),
      findAllRoles: jest.fn(),
      findRoleById: jest.fn(),
      deleteById: jest.fn(),
      updateById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
          useValue: mockRoleService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RoleController>(RoleController);
  });

  describe('Get all roles', () => {
    it('Should return an array of roles', async (): Promise<void> => {
      mockRoleService.findAllRoles.mockResolvedValue([mockRole]);
      const response: ResponseData<Role[]> = await controller.getAllRoles();

      expect(response).toStrictEqual([mockRole]);
    });

    it('Should throw Http Exception in case of exception', (): void => {
      mockRoleService.findAllRoles.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.getAllRoles).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', (): void => {
      mockRoleService.findAllRoles.mockRejectedValue(new Exception('exception'));

      expect(controller.getAllRoles()).rejects.toThrow(Exception);
    });
  });

  describe('Get role by id', (): void => {
    it('Should return a role by ID', async (): Promise<void> => {
      mockRoleService.findRoleById.mockResolvedValue(mockRole);
      const response: ResponseData<Role> = await controller.getRole(mockRole.id);

      expect(response).toStrictEqual(mockRole);
    });

    it('Should return NotFound if no role found', async (): Promise<void> => {
      const getResponse: MessageResponse = { message: ExceptionMessageConstant.ROLE_NOT_FOUND };
      mockRoleService.findRoleById.mockResolvedValue(getResponse);
      const response: ResponseData<Role> = await controller.getRole(mockRole.id);

      expect(response).toStrictEqual(getResponse);
    });

    it('Should throw Http Exception in case of exception', (): void => {
      mockRoleService.findRoleById.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.getRole).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', (): void => {
      mockRoleService.findRoleById.mockRejectedValue(new Exception('exception'));

      expect(controller.getRole(mockRole?.id)).rejects.toThrow(Exception);
    });
  });

  describe('Create role', () => {
    it('Should create a new role', async (): Promise<void> => {
      const createResponse: MessageResponse = { message: ResponseMessageConstant.ROLE_CREATED };
      mockRoleService.createRole.mockResolvedValue(createResponse);
      const response: ResponseData<MessageResponse> = await controller.createRole(mockRole);

      expect(response).toStrictEqual(createResponse);
    });

    it('Should throw Http Exception in case of exception', (): void => {
      mockRoleService.createRole.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.createRole).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', (): void => {
      mockRoleService.createRole.mockRejectedValue(new Exception('exception'));

      expect(controller.createRole(mockRole)).rejects.toThrow(Exception);
    });
  });

  describe('Delete role', () => {
    it('Should return NotFound if no role found', async (): Promise<void> => {
      const notFoundResponse: MessageResponse = { message: ExceptionMessageConstant.ROLE_NOT_FOUND };
      mockRoleService.deleteById.mockResolvedValue(notFoundResponse);
      const response: ResponseData<MessageResponse> = await controller.deleteRole(mockRole.id);

      expect(response).toStrictEqual(notFoundResponse);
    });

    it('Should delete a role by id', async (): Promise<void> => {
      const deleteResponse: MessageResponse = { message: ResponseMessageConstant.ROLE_REMOVED };
      mockRoleService.deleteById.mockResolvedValue(deleteResponse);
      const response: ResponseData<MessageResponse> = await controller.deleteRole(mockRole.id);

      expect(response).toStrictEqual(deleteResponse);
    });

    it('Should throw Http Exception in case of exception', (): void => {
      mockRoleService.deleteById.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.deleteRole).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', (): void => {
      mockRoleService.deleteById.mockRejectedValue(new Exception('exception'));

      expect(controller.deleteRole(mockRole?.id)).rejects.toThrow(Exception);
    });
  });

  describe('Update role', () => {
    it('Should return NotFound if no role found', async (): Promise<void> => {
      const notFoundResponse: MessageResponse = { message: ExceptionMessageConstant.ROLE_NOT_FOUND };
      mockRoleService.updateById.mockResolvedValue(notFoundResponse);
      const response: ResponseData<MessageResponse> = await controller.updateRole(mockRole.id, mockRole);

      expect(response).toStrictEqual(notFoundResponse);
    });

    it('Should update a role by id', async (): Promise<void> => {
      const updateResponse: MessageResponse = { message: ResponseMessageConstant.ROLE_UPDATED };
      mockRoleService.updateById.mockResolvedValue(updateResponse);
      const response: MessageResponse = await controller.updateRole(mockRole.id, mockRole);

      expect(response).toStrictEqual(updateResponse);
    });

    it('Should throw Http Exception in case of exception', (): void => {
      mockRoleService.updateById.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(controller.updateRole(mockRole?.id, mockRole)).rejects.toThrow(HttpException);
    });

    it('Should throw custom exception in case of Exception', (): void => {
      mockRoleService.updateById.mockRejectedValue(new Exception('exception'));

      expect(controller.updateRole(mockRole?.id, mockRole)).rejects.toThrow(Exception);
    });
  });
});
