import { User } from 'src/routes/v1/users/entities/user.entity';
import { EmailService } from '../mail-providers';
import { TwoFactorAuthenticationTemplate } from '../layouts/two-factor-authentication.template';
import { ForgotPasswordWithOtpTemplate } from '../templates/forgot-password-with-otp.template';
import { ForgotPasswordTemplate } from '../templates/forgot.password.template';
import { RegistrationTemplate } from '../templates/registration.template';
import { SetPasswordTemplate } from '../templates/set-password.template';
import { UnblockUserTemplate } from '../templates/unblock-user.template';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMailer {
  constructor(private readonly emailService: EmailService) {}

  twoFactorAuthentication(user: User, otp: string): Promise<void> {
    const subject: string = 'OTP request';
    const body: string = TwoFactorAuthenticationTemplate(user, otp);

    return this.emailService.sendEmail(user.email, subject, body);
  }

  userRegister(user: User): Promise<void> {
    const subject = 'Register Request';
    const body = RegistrationTemplate(user);
    return this.emailService.sendEmail(user?.email, subject, body);
  }

  forgotPassword(user: Partial<User>, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const body = ForgotPasswordTemplate(user, resetLink);
    return this.emailService.sendEmail(user?.email, subject, body);
  }

  setPassword(user: Partial<User>, resetLink: string): Promise<void> {
    const subject = 'Set Account Password';
    const body = SetPasswordTemplate(user, resetLink);
    return this.emailService.sendEmail(user?.email, subject, body);
  }

  forgotPasswordWithOTP(user: Partial<User>, otpValue: string): Promise<void> {
    const subject: string = 'Password Reset Request';
    const body: string = ForgotPasswordWithOtpTemplate(user, otpValue);
    return this.emailService.sendEmail(user?.email, subject, body);
  }

  unblockUser(email: string, unblockLink: string): Promise<void> {
    const subject: string = `Action Required - Suspicious Activity Detected`;
    const body: string = UnblockUserTemplate(email, unblockLink);
    return this.emailService.sendEmail(email, subject, body);
  }
}
