import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  deletePermissions?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  newPermissions?: number[];
}
