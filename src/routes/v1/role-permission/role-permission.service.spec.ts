import { Test, TestingModule } from '@nestjs/testing';
import { RolePermissionsService } from './role-permission.service';
import { RolePermissionRepository } from './role-permission.repository';
import { RolesPermission } from './entities/roles-permissions.entity';
import { NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from '../../../types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';

describe('RolePermissionsService', (): void => {
  let service: RolePermissionsService;
  let mockRolePermissionRepository: jest.MockedObject<Partial<RolePermissionRepository>>;
  const mockRolePermission: RolesPermission = {
    roleId: 1,
    permissionId: 2,
  } as RolesPermission;

  beforeEach(async (): Promise<void> => {
    mockRolePermissionRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findOneByProps: jest.fn(),
      getPermissionsOfRole: jest.fn(),
      getRolesOfPermission: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolePermissionsService,
        {
          provide: RolePermissionRepository,
          useValue: mockRolePermissionRepository,
        },
      ],
    }).compile();

    service = module.get<RolePermissionsService>(RolePermissionsService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('Create RolePermission', () => {
    it('Should create a new role permission', async (): Promise<void> => {
      mockRolePermissionRepository.create.mockReturnValue(mockRolePermission);
      mockRolePermissionRepository.save.mockResolvedValue(mockRolePermission);
      const response: ResponseData<RolesPermission> = await service.createRolePermission(mockRolePermission);

      expect(response).toStrictEqual(mockRolePermission);
    });

    it('Should be able to handle exceptions', (): void => {
      expect(service.createRolePermission).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get All RolePermissions', () => {
    it('Should return a list of role permissions', async (): Promise<void> => {
      const rolePermissions: RolesPermission[] = [{ id: 1 }, { id: 2 }] as RolesPermission[];
      mockRolePermissionRepository.findAll.mockResolvedValue(rolePermissions);
      const response: ResponseData<RolesPermission[]> = await service.findAllRolePermissions();

      expect(response).toStrictEqual(rolePermissions);
    });

    it('Should be able to handle exceptions', (): void => {
      mockRolePermissionRepository.findAll.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.findAllRolePermissions).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get RolePermission by id', () => {
    it('Should get a role against an id', async (): Promise<void> => {
      mockRolePermissionRepository.findOneByProps.mockResolvedValue(mockRolePermission);
      const response: ResponseData<RolesPermission> = await service.findRolePermissionById(1);

      expect(response).toStrictEqual(mockRolePermission);
    });

    it('Should return NotFound if no RolePermission found', async (): Promise<void> => {
      expect(service.findRolePermissionById(1)).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', (): void => {
      mockRolePermissionRepository.findOneByProps.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.findRolePermissionById).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get permissions of a role', () => {
    it('Should return permissions for a role', async (): Promise<void> => {
      const roleId = 1;
      const permissions: RolesPermission[] = [{ id: 1 }, { id: 2 }] as RolesPermission[];
      mockRolePermissionRepository.getPermissionsOfRole.mockResolvedValue(permissions);
      const response: ResponseData<RolesPermission[]> = await service.getPermissionsOfRole(roleId);

      expect(response).toStrictEqual(permissions);
    });

    it('Should return NotFound if no permission is assigned to a role', async (): Promise<void> => {
      expect(service.getPermissionsOfRole(mockRolePermission.roleId)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get roles of a permission', () => {
    it('Should return roles for a permission', async (): Promise<void> => {
      const permissionId = 1;
      const rolesPermissions: RolesPermission[] = [{ id: 1 }, { id: 2 }] as RolesPermission[];
      mockRolePermissionRepository.getRolesOfPermission.mockResolvedValue(rolesPermissions);
      const response: ResponseData<RolesPermission[]> = await service.getRolesOfPermission(permissionId);

      expect(response).toStrictEqual(rolesPermissions);
    });

    it('Should return NotFound if no role is assigned to this permission', async () => {
      expect(service.getRolesOfPermission(mockRolePermission.permissionId)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Assign Permissions to Role', (): void => {
    it('Should assign permissions to role', async (): Promise<void> => {
      const roleId: number = 1;
      const permissions: number[] = [1, 2];
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant?.ROLE_ASSIGNED };
      mockRolePermissionRepository.save.mockResolvedValue(mockRolePermission);

      const response: MessageResponse = await service.assignPermissionsToRole(permissions, roleId);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', (): void => {
      expect(service.assignPermissionsToRole).rejects.toThrow(UnhandledException);
    });
  });

  describe('Remove Permissions of Role', (): void => {
    it('Should remove the permissions of Role', async (): Promise<void> => {
      const roleId: number = 1;
      const permissions: number[] = [1, 2];
      mockRolePermissionRepository.delete.mockResolvedValue({ affected: 1, raw: {} });
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant?.PERMISSION_REMOVED };
      const response: MessageResponse = await service.removePermissionsOfRole(permissions, roleId);

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', (): void => {
      mockRolePermissionRepository.delete.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(service.removePermissionsOfRole).rejects.toThrow(UnhandledException);
    });
  });
});
