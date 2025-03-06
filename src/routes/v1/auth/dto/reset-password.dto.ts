import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../../../../constant/regular-expression.constant';
import { UserValidationConstant } from '../../../../../constant/validation-constants/user.validation.constant';

export class ResetPasswordDTO {
  @IsString({ message: `${UserValidationConstant?.IS_TOKEN_STRING}` })
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_TOKEN_EMPTY}` })
  token: string;

  @IsString({ message: `${UserValidationConstant?.IS_PASSWORD_STRING}` })
  @IsNotEmpty({ message: `${UserValidationConstant?.IS_PASSWORD_EMPTY}` })
  @Matches(PASSWORD_REGEX, {
    message: `${UserValidationConstant?.PASSWORD_POLICY_ENFORCEMENT}`,
  })
  password: string;
}
