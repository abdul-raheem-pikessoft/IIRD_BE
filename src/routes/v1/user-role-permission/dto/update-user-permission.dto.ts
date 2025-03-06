import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserPermissionDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  deletePermissions?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  newPermissions?: number[];
}
