import * as dotenv from 'dotenv';
import { User } from 'src/routes/v1/users/entities/user.entity';
import { Layout } from '../layouts/layout.template';

dotenv.config();

export const TwoFactorAuthenticationTemplate = (user: User, otp: string): string => {
  return Layout(`
  <center>
    <p>Hi ${user.name}</p>
    <p>${user.email}</p>
    <p> Please use the OTP to Login into your account</p>
    <h1>${otp}</h1> 
  </center>
  `);
};
