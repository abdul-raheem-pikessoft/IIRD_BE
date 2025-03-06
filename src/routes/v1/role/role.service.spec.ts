import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { Role } from './entities/roles.entity';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { RolePermissionsService } from '../role-permission/role-permission.service';
import { DuplicateException, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { MessageResponse, ResponseData } from 'src/types/response.type';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

describe('RolesService', (): void => {
  let service: RoleService;
  let mockRoleRepository: jest.MockedObject<Partial<RoleRepository>>;
  let mockRolePermissionService: jest.MockedObject<RolePermissionsService>;
  const mockRole = {
    id: 1,
    name: 'test Role',
  } as Role;

  beforeEach(async (): Promise<void> => {
    mockRoleRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findOneByProps: jest.fn(),
      deleteById: jest.fn(),
    };

    mockRolePermissionService = {
      assignPermissionsToRole: jest.fn(),
      removePermissionsOfRole: jest.fn(),
    } as jest.MockedObject<RolePermissionsService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleRepository,
          useValue: mockRoleRepository,
        },
        {
          provide: RolePermissionsService,
          useValue: mockRolePermissionService,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Role Creation', () => {
    it('Should create a new role with permissions', async (): Promise<void> => {
      const createResponse: MessageResponse = { message: ResponseMessageConstant.ROLE_CREATED };
      mockRoleRepository.create.mockResolvedValue(mockRole);
      const response: ResponseData<MessageResponse> = await service.createRole({ name: mockRole.name, permissions: [1, 2, 3] });

      expect(response).toStrictEqual(createResponse);
    });

    it('Should handle the duplicate exceptions', () => {
      mockRoleRepository.save.mockRejectedValue(new DuplicateException(ExceptionMessageConstant?.DUPLICATE));
      expect(service.createRole({ name: mockRole.name, permissions: [1, 2, 3] })).rejects.toThrow(DuplicateException);
    });

    it('Should handle the exceptions', () => {
      mockRoleRepository.save.mockRejectedValue(new UnhandledException('exception'));
      expect(service.createRole({ name: mockRole.name, permissions: [1, 2, 3] })).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get all roles', () => {
    it('Should retrieve all roles', async (): Promise<void> => {
      mockRoleRepository.findAll.mockResolvedValue([mockRole]);
      const response: ResponseData<Role[]> = await service.findAllRoles();

      expect(response).toStrictEqual([mockRole]);
    });

    it('Should handle the exceptions', () => {
      mockRoleRepository.findAll.mockRejectedValue(new UnhandledException('exception'));
      expect(service.findAllRoles).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get role by id', () => {
    it('Should get a role against an id', async (): Promise<void> => {
      mockRoleRepository.findOneByProps.mockResolvedValue(mockRole);
      const response: ResponseData<Role> = await service.findRoleById(mockRole.id);

      expect(response).toStrictEqual(mockRole);
    });

    it('Should return NotFound if no role found', async (): Promise<void> => {
      expect(service.findRoleById(mockRole?.id)).rejects.toThrow(NotFoundException);
    });

    it('Should handle the exceptions', () => {
      mockRoleRepository.findOneByProps.mockRejectedValue(new UnhandledException('exception'));

      expect(service.findRoleById).rejects.toThrow(UnhandledException);
    });
  });

  describe('Delete Role', () => {
    it('Should delete a role successfully', async (): Promise<void> => {
      const deleteResponse: MessageResponse = { message: ResponseMessageConstant.ROLE_REMOVED };
      mockRoleRepository.findOneByProps.mockResolvedValue(mockRole);
      const response: ResponseData<MessageResponse> = await service.deleteById(mockRole.id);

      expect(response).toStrictEqual(deleteResponse);
    });

    it('Should return NotFound if no role found', async (): Promise<void> => {
      expect(service.deleteById(mockRole?.id)).rejects.toThrow(NotFoundException);
    });

    it('Should handle the exceptions', () => {
      mockRoleRepository.findOneByProps.mockRejectedValue(new UnhandledException('exception'));

      expect(service.deleteById).rejects.toThrow(UnhandledException);
    });
  });

  describe('Update Role', () => {
    it('Should update a role successfully', async (): Promise<void> => {
      const updateRoleResponse: MessageResponse = { message: ResponseMessageConstant.ROLE_UPDATED };
      mockRoleRepository.findOneByProps.mockResolvedValue(mockRole);
      mockRoleRepository.save.mockResolvedValue(mockRole);
      const response: ResponseData<MessageResponse> = await service.updateById(1, {
        name: mockRole.name,
        newPermissions: [1, 2],
        deletePermissions: [3, 4],
      });

      expect(response).toStrictEqual(updateRoleResponse);
    });

    it('Should return NotFound if no role found', async (): Promise<void> => {
      expect(service.updateById(mockRole?.id, { name: mockRole.name, newPermissions: [1, 2], deletePermissions: [3, 4] })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('Should handle the exceptions', (): void => {
      mockRoleRepository.findOneByProps.mockRejectedValue(new UnhandledException('exception'));

      expect(service.updateById).rejects.toThrow(UnhandledException);
    });
  });
});
