import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../../../../constant/regular-expression.constant';
import { UserValidationConstant } from '../../../../../constant/validation-constants/user.validation.constant';

export class ResetPasswordWithOtpDto {
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_EMAIL_EMPTY}` })
  @IsEmail({}, { message: `${UserValidationConstant?.IS_EMAIL_INVALID}` })
  email: string;

  @IsNotEmpty({ message: `${UserValidationConstant?.IS_PASSWORD_EMPTY}` })
  @IsString({ message: `${UserValidationConstant?.IS_PASSWORD_STRING}` })
  @Matches(PASSWORD_REGEX, {
    message: `${UserValidationConstant?.PASSWORD_POLICY_ENFORCEMENT}`,
  })
  password: string;

  @IsNotEmpty({ message: `${UserValidationConstant?.IS_OTP_EMPTY}` })
  @IsString({ message: `${UserValidationConstant?.IS_OTP_STRING}` })
  otp: string;
}
