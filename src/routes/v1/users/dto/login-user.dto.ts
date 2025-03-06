import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { UserValidationConstant } from '../../../../../constant/validation-constants/user.validation.constant';
import { SocialProviderEnum } from '../../../../enums/social-provider-type.enum';

export class LoginUserDto {
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_EMAIL_EMPTY}` })
  @IsEmail({}, { message: `${UserValidationConstant?.IS_EMAIL_INVALID}` })
  email: string;

  @ValidateIf((dto) => dto.socialId === undefined)
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_PASSWORD_EMPTY}` })
  @IsString({ message: `${UserValidationConstant?.IS_PASSWORD_STRING}` })
  password?: string;

  @ApiProperty()
  @ValidateIf((dto) => dto.password === undefined)
  @IsNotEmpty()
  @IsString()
  socialId?: string;

  @ApiProperty()
  @ValidateIf((dto) => dto.socialId !== undefined)
  @IsNotEmpty({ message: 'Social Provider is required for social login.' })
  @IsEnum(SocialProviderEnum)
  socialProvider?: SocialProviderEnum;

  @ApiProperty()
  @ValidateIf((dto) => dto.socialId !== undefined)
  @IsNotEmpty({ message: 'Name is required for social login.' })
  name?: string;
}
