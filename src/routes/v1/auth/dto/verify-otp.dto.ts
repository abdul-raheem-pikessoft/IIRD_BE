import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserValidationConstant } from '../../../../../constant/validation-constants/user.validation.constant';

export class VerifyOtpDto {
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_EMAIL_EMPTY}` })
  @IsEmail({}, { message: `${UserValidationConstant?.IS_EMAIL_INVALID}` })
  email: string;

  @IsNotEmpty({ message: `${UserValidationConstant?.IS_OTP_EMPTY}` })
  @IsString({ message: `${UserValidationConstant?.IS_OTP_STRING}` })
  otp: string;
}
