import { Injectable } from '@nestjs/common';
import { Permission } from 'src/routes/v1/permissions/entities/permissions.entity';
import { PermissionsRepository } from 'src/routes/v1/permissions/permissions.repository';
import { Role } from 'src/routes/v1/role/entities/roles.entity';
import { RoleRepository } from 'src/routes/v1/role/role.repository';
import { User } from 'src/routes/v1/users/entities/user.entity';
import { UserRepository } from 'src/routes/v1/users/user.repository';
import { PermissionData } from './data/permissions.data';
import { RoleData } from './data/role.data';
import { RolesPermission } from 'src/routes/v1/role-permission/entities/roles-permissions.entity';
import { RolePermissionRepository } from 'src/routes/v1/role-permission/role-permission.repository';
import { AppHelperService } from '../helpers/app.helper';
import { RolePermissionMapper } from "../mappers/role-permissions.mappers";
import { In } from 'typeorm';
import { ExceptionMessageConstant } from "../../constant/exception-message.constant";
import {RoleEnum} from "../enums/role.enum";
import {NotFoundException} from "../exceptions/custom-exception";
import {LanguageEnum} from "../enums/language.enum";
import {UserRolePermissionService} from "../routes/v1/user-role-permission/user-role-permission.service";
const usersSeederEmail: string = process.env.USERS_SEEDER_EMAIL || '';
const usersSeederPassword: string = process.env.USERS_SEEDER_PASSWORD || '';

@Injectable()
export class SeederService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionsRepository: PermissionsRepository,
    private readonly userRepository: UserRepository,
    private readonly userRolePermissionService: UserRolePermissionService,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  async addRoles(): Promise<void> {
    for (const role of RoleData) {
      const roleEntity: Role = await this.roleRepository.findOneByProps({ name: role });
      if (!roleEntity) {
        const roleData: Role = await this.roleRepository.create(role);
        await this.roleRepository.save(roleData);
      }
    }
    console.log('Roles added!');
  }

  async addPermissions(): Promise<void> {
    for (const permission of PermissionData) {
      const permissionEntity: Permission = await this.permissionsRepository.findOneByProps({ name: permission });
      if (!permissionEntity) {
        const permissionData: Permission =  this.permissionsRepository.create({ name: permission });
        await this.permissionsRepository.save(permissionData);
      }
    }
    console.log('Permissions added!');
  }
  async addUsers(): Promise<void> {
    const email: string = usersSeederEmail?.replace('@', `+1@`);
    const existingUser: User = await this.userRepository.findOneByProp({ email });
    if (!existingUser) {
      const role: Role = await this.roleRepository.findOneByProps({ name: RoleEnum.ADMIN });

      if (!role) {
        throw new NotFoundException(ExceptionMessageConstant?.ROLE_NOT_FOUND);
      }

      const data: User = new User();
      data.name = 'John Doe';
      data.isActive = true;
      data.languagePreference = LanguageEnum.EN;
      data.email = email?.toLowerCase();
      data.salt = AppHelperService.generateSalt();
      data.password = AppHelperService.hashPassword(usersSeederPassword, data?.salt);
      const user: User = await this.userRepository.saveUser(data);
      await this.userRolePermissionService.create({
        userId: user.id,
        roleId: role.id,
      });
    }
    console.log('SuperAdmin User added!');
  }


  async assignPermissionsToRoles(): Promise<void> {
    for (const [roleName, permissionsList] of Object.entries(RolePermissionMapper)) {
      const roleEntity: Role = await this.roleRepository.findOneByProps({ name: roleName });

      if (roleEntity) {
        const permissions: Permission[] = await this.permissionsRepository.findAllByProps({
          name: In(permissionsList),
        });

        for (const permission of permissions) {
          const existingRolePermission: RolesPermission = await this.rolePermissionRepository.findOneByProps({
            roleId: roleEntity.id,
            permissionId: permission.id,
          });

          if (!existingRolePermission) {
            const rolePermission = this.rolePermissionRepository.create({
              roleId: roleEntity.id,
              permissionId: permission.id,
            });
            await this.rolePermissionRepository.save(rolePermission);
          }
        }
        console.log(`Permissions assigned to ${roleName}`);
      }
    }
    console.log('All role permissions assigned!');
  }
}
