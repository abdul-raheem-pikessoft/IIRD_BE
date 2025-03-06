import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignPermissionsDTO {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsArray()
  permissions: number[];
}
