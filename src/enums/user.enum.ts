export enum UserTokenTypeEnum {
  INVITE_TOKEN = 'invite_token',
  REFRESH_TOKEN = 'refresh_token',
  HASHED_REFRESH_TOKEN = 'hashed_refresh_token',
  ACCESS_TOKEN = 'access_token',
  FORGOT_PASSWORD_TOKEN = 'forgot_password',
  LOGIN_OTP = 'login_otp',
  FORGOT_PASSWORD_OTP = 'forgot_password_otp',
  BLOCK_USER = 'block_user',
  SET_PASSWORD = 'set_password',
}

export enum UserOtpTypeEnum {
  LOGIN_OTP = 'login_otp',
  FORGOT_PASSWORD_OTP = 'forgot_password_otp',
}
