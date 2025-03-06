import { Layout } from '../layouts/layout.template';
import * as dotenv from 'dotenv';
import { User } from '../../routes/v1/users/entities/user.entity';

dotenv.config();

export const ForgotPasswordWithOtpTemplate = (user: Partial<User>, otpValue: string) => {
  return Layout(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
    <style>
      body {
        font-family: Arial, sans-serif;
      }
      .container {
        text-align: center;
      }
      h2 {
        color: #333;
      }
      p {
        margin: 10px 0;
      }
      strong {
        color: blue;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account associated with the email address:</p>
      <p><strong>${user?.email}</strong></p>
      <p>If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, please use the below OTP:</p>
      <p>${otpValue}</p>
      <p>This OTP is valid for the next ${process.env.OTP_EXPIRY_TIME} minutes. After that, you will need to request another password reset.</p>
      <p>If you have any questions or need assistance, please contact our support team at support@example.com.</p>
      <p>Thank you,</p>
    </div>
  </body>
  </html>  
  `);
};
