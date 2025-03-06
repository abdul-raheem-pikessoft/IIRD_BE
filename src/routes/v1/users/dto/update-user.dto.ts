import {IsBoolean, IsNumber, IsOptional, IsString, Matches} from 'class-validator';
import { LanguageEnum } from '../../../../enums/language.enum';
import { UserValidationConstant } from '../../../../../constant/validation-constants/user.validation.constant';
import { PASSWORD_REGEX } from '../../../../../constant/regular-expression.constant';
import { ForAdmin } from '../../../../decorators/for-admin-dto.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString({ message: `${UserValidationConstant?.IS_PASSWORD_STRING}` })
  @Matches(PASSWORD_REGEX, { message: `${UserValidationConstant?.PASSWORD_POLICY_ENFORCEMENT}` })
  password?: string;

  @IsOptional()
  @ForAdmin()
  @IsNumber({}, { each: true })
  newRoles?: number[] = [];

  @IsOptional()
  @ForAdmin()
  @IsNumber({}, { each: true })
  deleteRoles?: number[] = [];

  @IsOptional()
  @ForAdmin()
  @IsNumber({}, { each: true })
  newPermissions?: number[] = [];

  @IsOptional()
  @ForAdmin()
  @IsNumber({}, { each: true })
  deletePermissions?: number[] = [];

  @IsOptional()
  @IsString()
  languagePreference?: LanguageEnum = LanguageEnum.EN;

  @IsBoolean()
  @IsOptional()
  isTwoFactorAuth: boolean = false;
}
