import { IsNotEmpty, IsNumber } from 'class-validator';
import { RolePermissionValidationConstant } from '../../../../../constant/validation-constants/role-permission.validation.constant';

export class CreateRolePermissionDto {
  @IsNotEmpty({ message: `${RolePermissionValidationConstant?.IS_ROLE_ID_EMPTY}` })
  @IsNumber({}, { message: `${RolePermissionValidationConstant?.IS_ROLE_ID_NUMBER}` })
  roleId: number;

  @IsNotEmpty({ message: `${RolePermissionValidationConstant?.IS_PERMISSION_ID_EMPTY}` })
  @IsNumber({}, { message: `${RolePermissionValidationConstant?.IS_PERMISSION_ID_NUMBER}` })
  permissionId: number;
}
