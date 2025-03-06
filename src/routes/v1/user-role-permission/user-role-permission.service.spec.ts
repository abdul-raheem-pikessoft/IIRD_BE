import { Test, TestingModule } from '@nestjs/testing';
import { UserRolePermissionService } from './user-role-permission.service';
import { UserRolePermissionRepository } from './user-role-permission.repository';
import { UserRolePermission } from './entities/user-role.entity';
import { NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { AssignRolesDTO } from './dto/assign-user-role.dto';
import { AssignPermissionsDTO } from './dto/assign-user-permissions.dto';
import { DeleteResult } from 'typeorm';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserSpecificPermissionDto } from './dto/user-specific.permission.dto';

describe('UserRolePermissionService', () => {
  let service: UserRolePermissionService;
  let mockUserRolePermissionRepository: jest.MockedObject<Partial<UserRolePermissionRepository>>;
  const mockUserRolePermission = {
    userId: 1,
    roleId: 2,
    permissionId: 3,
  } as UserRolePermission;

  const mockAssignRoleDto: AssignRolesDTO = {
    userId: 1,
    roles: [1, 2],
  };

  const mockAssignPermissionDto: AssignPermissionsDTO = {
    userId: 1,
    permissions: [1, 2],
  };

  const mockUpdateUserRoleDto: UpdateUserRoleDto = {
    deleteRoles: [1, 2],
    newRoles: [3, 4],
  };

  const mockUpdateUserPermissionDto: UpdateUserPermissionDto = {
    deletePermissions: [1, 2],
    newPermissions: [3, 4],
  };

  beforeEach(async () => {
    mockUserRolePermissionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      getRolesOfUser: jest.fn(),
      getPermissionsOfUser: jest.fn(),
      deleteRoleOrPermissions: jest.fn(),
      findByProps: jest.fn(),
      findByUserId: jest.fn(),
      findUserRolePermissionByUserAndPermissionId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolePermissionService,
        {
          provide: UserRolePermissionRepository,
          useValue: mockUserRolePermissionRepository,
        },
      ],
    }).compile();

    service = module.get<UserRolePermissionService>(UserRolePermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create UserRolePermission', () => {
    it('should create a user role permission', async () => {
      mockUserRolePermissionRepository.create.mockReturnValue(mockUserRolePermission);
      mockUserRolePermissionRepository.save.mockResolvedValue(mockUserRolePermission);
      const response: ResponseData<UserRolePermission> = await service.create(mockUserRolePermission);

      expect(response).toStrictEqual(mockUserRolePermission);
    });

    it('should throw Unhandled Exception in case of Exception', (): void => {
      mockUserRolePermissionRepository.save.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.create(mockUserRolePermission)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find all UserRolePermissions', () => {
    it('should return a list of user role permissions', async () => {
      const userRolePermissions: ResponseData<UserRolePermission[]> = [{ id: 1 }, { id: 2 }] as UserRolePermission[];
      mockUserRolePermissionRepository.findAll.mockResolvedValue(userRolePermissions);
      const response: ResponseData<UserRolePermission[]> = await service.findAllRolePermissions();

      expect(response).toStrictEqual(userRolePermissions);
    });

    it('Should thorw Unhandled Exception in case of Exception', (): void => {
      mockUserRolePermissionRepository.findAll.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.findAllRolePermissions()).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find UserRolePermission by id', () => {
    it('Should return a UserRolePermission by id', async () => {
      const id: number = 1;
      mockUserRolePermissionRepository.findById.mockResolvedValue(mockUserRolePermission);
      const response: ResponseData<UserRolePermission> = await service.findRolePermissionById(id);

      expect(response).toStrictEqual(mockUserRolePermission);
    });

    it('Should return a NotFound if no UserRolePermission found', async () => {
      mockUserRolePermissionRepository.findById.mockResolvedValue(null);
      expect(service.findRolePermissionById(1)).rejects.toThrow(NotFoundException);
    });

    it('Should throw Unhandled Exception in case of Exception', async () => {
      mockUserRolePermissionRepository.findById.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.findRolePermissionById(1)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get roles of a user', () => {
    it('Should return role of a user', async () => {
      const userId: number = 1;
      const roles = [{ id: 1 }, { id: 2 }] as UserRolePermission[];
      mockUserRolePermissionRepository.getRolesOfUser.mockResolvedValue(roles);
      const response: ResponseData<UserRolePermission[]> = await service.getRolesOfUser(userId);

      expect(response).toStrictEqual(roles);
    });

    it('Should return NotFound if no role is assigned to the user', async () => {
      mockUserRolePermissionRepository.getRolesOfUser.mockResolvedValue([]);
      expect(service.getRolesOfUser(mockUserRolePermission.userId)).rejects.toThrow(NotFoundException);
    });

    it('Should throw Unhandled Exception in case of Exception', async () => {
      mockUserRolePermissionRepository.getRolesOfUser.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.getRolesOfUser(1)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get Permissions of a user', () => {
    it('Should return Permission of a user', async () => {
      const userId: number = 1;
      const permissions = [{ id: 1 }, { id: 2 }] as UserRolePermission[];
      mockUserRolePermissionRepository.getPermissionsOfUser.mockResolvedValue(permissions);
      const response: ResponseData<UserRolePermission[]> = await service.getPermissionsOfUser(userId);

      expect(response).toStrictEqual(permissions);
    });

    it('Should return NotFound if the user has no permissions', async () => {
      mockUserRolePermissionRepository.getPermissionsOfUser.mockResolvedValue([]);
      expect(service.getPermissionsOfUser(mockUserRolePermission.userId)).rejects.toThrow(NotFoundException);
    });

    it('Should throw Unhandled Exception in case of Exception', async () => {
      mockUserRolePermissionRepository.getPermissionsOfUser.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.getPermissionsOfUser(1)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Assign Roles', (): void => {
    it('Should assign roles to user', async (): Promise<void> => {
      const response: ResponseData<MessageResponse> = await service.assignRoles(mockAssignRoleDto);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.ROLE_ASSIGNED,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockUserRolePermissionRepository.save.mockRejectedValue(new Error());

      expect(service.assignRoles(mockAssignRoleDto)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Assign Permissions', () => {
    it('Should assign permissions to user', async (): Promise<void> => {
      const response: ResponseData<MessageResponse> = await service.assignPermissions(mockAssignPermissionDto);
      const expectedResponse: ResponseData<MessageResponse> = {
        message: ResponseMessageConstant.PERMISSION_ASSIGNED,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockUserRolePermissionRepository.save.mockRejectedValue(new Error());

      expect(service.assignPermissions(mockAssignPermissionDto)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Update User Roles', () => {
    it('Should update the user roles', async (): Promise<void> => {
      const deletedBYResponse: DeleteResult = {
        raw: [],
        affected: 1,
      };

      mockUserRolePermissionRepository.deleteRoleOrPermissions.mockResolvedValue(deletedBYResponse);
      mockUserRolePermissionRepository.findByProps.mockResolvedValueOnce(mockUserRolePermission);
      mockUserRolePermissionRepository.save.mockResolvedValueOnce(mockUserRolePermission);

      const response: ResponseData<MessageResponse> = await service.updateUserRoles(mockUpdateUserRoleDto, 1);
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_ROLES_UPDATED };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle bad request exceptions', async (): Promise<void> => {
      mockUserRolePermissionRepository.deleteRoleOrPermissions.mockRejectedValue(new UnhandledException('unhandled exception'));

      expect(service.updateUserRoles(mockUpdateUserRoleDto, 1)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Update User Permissions', () => {
    it('Should update the user permissions', async (): Promise<void> => {
      mockUserRolePermissionRepository.findByProps.mockResolvedValueOnce(mockUserRolePermission);

      const response: ResponseData<MessageResponse> = await service.updateUserPermissions(mockUpdateUserPermissionDto, 1);
      const expectedResponse: ResponseData<MessageResponse> = { message: ResponseMessageConstant.USER_PERMISSIONS_UPDATED };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockUserRolePermissionRepository.deleteRoleOrPermissions.mockRejectedValue(new Error());

      expect(service.updateUserPermissions(mockUpdateUserPermissionDto, 1)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get user role permission by userId and permissionId', (): void => {
    const body: UserSpecificPermissionDto = {
      userId: 1,
      permissionId: 1,
    };

    it('Should get a user role permission against userId and permissionId', async (): Promise<void> => {
      mockUserRolePermissionRepository.findUserRolePermissionByUserAndPermissionId.mockResolvedValue(mockUserRolePermission);
      const response: ResponseData<UserRolePermission> = await service.findUserRolePermissionByUserAndPermissionId(body);

      expect(response).toStrictEqual(mockUserRolePermission);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockUserRolePermissionRepository.findUserRolePermissionByUserAndPermissionId.mockRejectedValue(new Error());

      expect(service.findUserRolePermissionByUserAndPermissionId(body)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find Role Permission By User', (): void => {
    it('Should retreive the user roles permissions', async (): Promise<void> => {
      mockUserRolePermissionRepository.findByUserId.mockResolvedValue([mockUserRolePermission]);
      const response: ResponseData<UserRolePermission[]> = await service.findRolePermissionByUser(mockUserRolePermission?.userId);

      expect(response).toStrictEqual([mockUserRolePermission]);
    });

    it('Should throw NotFoundException if no UserRolePermission found', (): void => {
      mockUserRolePermissionRepository.findByUserId.mockResolvedValue([]);
      expect(service.findRolePermissionByUser(mockUserRolePermission?.userId)).rejects.toThrow(NotFoundException);
    });

    it('Should handle the exceptions', (): void => {
      mockUserRolePermissionRepository.findByUserId.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.findRolePermissionByUser(mockUserRolePermission?.userId)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Find One By Props', (): void => {
    it('Should retreive UserRolePermissions by props', async (): Promise<void> => {
      mockUserRolePermissionRepository.findByProps.mockResolvedValue(mockUserRolePermission);
      const response: UserRolePermission = await service.findOneByProps({ userId: mockUserRolePermission?.userId });

      expect(response).toStrictEqual(mockUserRolePermission);
    });

    it('Should handle the exceptions', (): void => {
      mockUserRolePermissionRepository.findByProps.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.findOneByProps({ userId: mockUserRolePermission?.userId })).rejects.toThrow(UnhandledException);
    });
  });
});
