import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserRoleDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  deleteRoles: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  newRoles: number[];
}
