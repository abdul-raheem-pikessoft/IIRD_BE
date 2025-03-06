import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { Permission } from './entities/permissions.entity';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { DuplicateException, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { ListingResponseData, MessageResponse, ResponseData } from 'src/types/response.type';
import { CreatePermissionDTO } from './dto/create-permission.dto';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

describe('Permissions Service', () => {
  let permissionsService: PermissionsService;
  let mockPermissionsRepository: jest.MockedObject<Partial<PermissionsRepository>>;
  const mockPermission: Permission = {
    id: 1,
    name: 'test permission',
  } as Permission;

  beforeEach(async (): Promise<void> => {
    mockPermissionsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findAll: jest.fn(),
      findOneByProps: jest.fn(),
      deleteById: jest.fn(),
      findAllByProps: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PermissionsRepository,
          useValue: mockPermissionsRepository,
        },
      ],
    }).compile();

    permissionsService = module.get<PermissionsService>(PermissionsService);
  });

  it('Should be defined', () => {
    expect(permissionsService).toBeDefined();
  });

  describe('Create a permission', () => {
    const mockCreatePermissionDto: CreatePermissionDTO = {
      name: 'test permission',
    };

    it('Should create a new permission', async (): Promise<void> => {
      mockPermissionsRepository.create.mockReturnValue(mockPermission);
      mockPermissionsRepository.save.mockResolvedValue(mockPermission);
      const response: ResponseData<Permission> = await permissionsService.createPermission(mockCreatePermissionDto);

      expect(response).toStrictEqual(mockPermission);
    });

    it('Should throw Duplicate Exception in case of duplicate permission', async () => {
      mockPermissionsRepository.save.mockRejectedValue(new DuplicateException(ExceptionMessageConstant?.DUPLICATE));
      expect(permissionsService.createPermission(mockCreatePermissionDto)).rejects.toThrow(DuplicateException);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockPermissionsRepository.save.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(permissionsService.createPermission(mockCreatePermissionDto)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get all permissions', () => {
    it('Should return an array of permissions', async (): Promise<void> => {
      mockPermissionsRepository.findAll.mockResolvedValue([[mockPermission], 1]);
      const response: ListingResponseData<Permission> = await permissionsService.findAllPermissions();
      const expectedResponse: ListingResponseData<Permission> = {
        records: [mockPermission],
        count: 1,
      };

      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockPermissionsRepository.findAll.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(permissionsService.findAllPermissions()).rejects.toThrow(UnhandledException);
    });
  });

  describe('Get a permission by id', () => {
    it('Should return a permission against an id', async (): Promise<void> => {
      mockPermissionsRepository.findOneByProps.mockResolvedValue(mockPermission);
      const response: ResponseData<Permission> = await permissionsService.findPermissionById(mockPermission.id);

      expect(response).toStrictEqual(mockPermission);
    });

    it('Should throw NotFound Exception if no permission found', (): void => {
      mockPermissionsRepository.findOneByProps.mockResolvedValue(undefined);
      expect(permissionsService.findPermissionById(mockPermission?.id)).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', () => {
      mockPermissionsRepository.findOneByProps.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(permissionsService.findPermissionById(mockPermission?.id)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Delete Permission', (): void => {
    it('Should delete a permission by ID', async (): Promise<void> => {
      const deleteResponse: MessageResponse = { message: ResponseMessageConstant.PERMISSION_REMOVED };
      mockPermissionsRepository.findOneByProps.mockResolvedValue(mockPermission);
      mockPermissionsRepository.deleteById.mockResolvedValue(mockPermission);
      const response: MessageResponse = await permissionsService.delete(mockPermission.id);

      expect(response).toStrictEqual(deleteResponse);
    });

    it('Should throw NotFound Exception if no permission found', async (): Promise<void> => {
      mockPermissionsRepository.findOneByProps.mockResolvedValue(undefined);
      expect(permissionsService.delete(mockPermission?.id)).rejects.toThrow(NotFoundException);
    });

    it('Should be able to handle exceptions', async (): Promise<void> => {
      mockPermissionsRepository.findOneByProps.mockRejectedValue(new UnhandledException('unhandled exception'));
      expect(permissionsService.delete(mockPermission?.id)).rejects.toThrow(UnhandledException);
    });
  });
});
