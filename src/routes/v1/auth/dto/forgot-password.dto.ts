import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserValidationConstant } from '../../../../../constant/validation-constants/user.validation.constant';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: `${UserValidationConstant?.IS_EMAIL_INVALID}` })
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_EMAIL_EMPTY}` })
  email: string;
}
