import { IsNotEmpty, IsString } from 'class-validator';
import { PermissionValidationConstant } from '../../../../../constant/validation-constants/permissions.validation.constant';

export class CreatePermissionDTO {
  @IsNotEmpty({ message: `${PermissionValidationConstant?.IS_PERMISSION_NAME_EMPTY}` })
  @IsString({ message: `${PermissionValidationConstant?.IS_PERMISSION_NAME_STRING}` })
  name: string;
}
