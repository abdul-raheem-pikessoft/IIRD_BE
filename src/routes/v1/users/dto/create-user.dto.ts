import {IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  roles?: number[];

  @IsOptional()
  @IsNumber({}, { each: true })
  permissions?: number[];

  @IsBoolean()
  @IsOptional()
  isTwoFactorAuth?: boolean = false;
}
