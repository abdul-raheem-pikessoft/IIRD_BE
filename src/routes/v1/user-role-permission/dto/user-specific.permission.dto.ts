import { IsNumber, IsOptional } from 'class-validator';

export class UserSpecificPermissionDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  permissionId?: number;
}
