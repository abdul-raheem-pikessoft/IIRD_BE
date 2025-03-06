import { Test, TestingModule } from '@nestjs/testing';
import { UserRolePermissionController } from './user-role-permission.controller';
import { UserRolePermissionService } from './user-role-permission.service';
import { UserRolePermission } from './entities/user-role.entity';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';
import { ResponseData } from 'src/types/response.type';

describe('User RolesPermissions Controller', () => {
  let controller: UserRolePermissionController;
  let mockUserRolePermissionService: jest.MockedObject<Partial<UserRolePermissionService>>;

  const mockUserRolePermission = {
    userId: 1,
    roleId: 1,
    permissionId: 1,
  } as UserRolePermission;

  beforeEach(async () => {
    mockUserRolePermissionService = {
      create: jest.fn(),
      findAllRolePermissions: jest.fn(),
      findRolePermissionById: jest.fn(),
      getPermissionsOfUser: jest.fn(),
      getRolesOfUser: jest.fn(),
      assignRoles: jest.fn(),
      updateUserRoles: jest.fn(),
    } as jest.MockedObject<Partial<UserRolePermissionService>>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolePermissionController],
      providers: [
        {
          provide: UserRolePermissionService,
          useValue: mockUserRolePermissionService,
        },
      ],
    }).compile();

    controller = module.get<UserRolePermissionController>(UserRolePermissionController);
  });

  describe('Create UserRolePermission', () => {
    it('Should create a new user role permission', async () => {
      mockUserRolePermissionService.create.mockResolvedValue(mockUserRolePermission);
      const response: ResponseData<UserRolePermission> = await controller.createRolePermission(mockUserRolePermission);

      expect(response).toStrictEqual(mockUserRolePermission);
    });
    it('Should be able to handle exceptions', async () => {
      mockUserRolePermissionService.create.mockRejectedValue(new Error());
      expect(controller.createRolePermission(mockUserRolePermission)).rejects.toThrow(UnhandledException);
    });

    it('Should throw custom exceptions in case of Exceptions', async () => {
      mockUserRolePermissionService.create.mockRejectedValue(new Exception('exception'));
      expect(controller.createRolePermission(mockUserRolePermission)).rejects.toThrow(Exception);
    });
  });

  describe('Get roles of a user', () => {
    it('Should get all roles of a user', async () => {
      mockUserRolePermissionService.getRolesOfUser.mockResolvedValue([mockUserRolePermission]);
      const response: ResponseData<UserRolePermission[]> = await controller.getRolesOfUser(1);

      expect(response).toStrictEqual([mockUserRolePermission]);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRolePermissionService.getRolesOfUser.mockRejectedValue(new Error());
      expect(controller.getRolesOfUser(mockUserRolePermission.userId)).rejects.toThrow(UnhandledException);
    });

    it('Should throw custom exceptions in case of Exceptions', async () => {
      mockUserRolePermissionService.getRolesOfUser.mockRejectedValue(new Exception('exception'));
      expect(controller.getRolesOfUser(mockUserRolePermission?.userId)).rejects.toThrow(Exception);
    });
  });

  describe('Get permissions of a user', () => {
    it('Should get all permissions of a user', async () => {
      mockUserRolePermissionService.getPermissionsOfUser.mockResolvedValue([mockUserRolePermission]);
      const response: ResponseData<UserRolePermission[]> = await controller.getPermissionsOfUser(1);

      expect(response).toStrictEqual([mockUserRolePermission]);
    });

    it('Should be able to handle exceptions', async () => {
      mockUserRolePermissionService.getPermissionsOfUser.mockRejectedValue(new Error());
      expect(controller.getPermissionsOfUser(mockUserRolePermission.userId)).rejects.toThrow(UnhandledException);
    });

    it('Should throw custom exceptions in case of Exceptions', async () => {
      mockUserRolePermissionService.getPermissionsOfUser.mockRejectedValue(new Exception('exception'));
      expect(controller.getPermissionsOfUser(mockUserRolePermission?.userId)).rejects.toThrow(Exception);
    });
  });
});
