import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignRolesDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  roles: number[];
}
