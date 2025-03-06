import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserRoleDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsNumber()
  permissionId?: number;
}
