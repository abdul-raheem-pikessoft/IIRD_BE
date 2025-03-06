import { User } from '@sentry/node';
import { Layout } from '../layouts/layout.template';
import * as dotenv from 'dotenv';

dotenv.config();

export const ForgotPasswordTemplate = (user: Partial<User>, resetLink: string) => {
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
        background-color: #f2f2f2;
      }
  
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
  
      .header {
        color: #2c3e50;
        background-color: #3498db;
        padding: 15px;
        text-align: center;
      }
  
      .email-link {
        color: #3498db;
        text-decoration: none;
      }
  
      .email-link:hover {
        text-decoration: underline;
      }
  
      .reset-btn {
        display: inline-block;
        background-color: #3498db;
        color: #ffffff;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 15px;
        transition: background-color 0.3s ease;
      }
  
      .reset-btn:hover {
        background-color: #2980b9;
      }
  
      .support-link {
        color: #3498db;
        text-decoration: none;
      }
  
      .support-link:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <h2 class="header">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account associated with the email address:</p>
      <p><strong><a href="mailto:${user?.email}" class="email-link">${user?.email}</a></strong></p>
      <p>If you did not make this request, you can safely ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <a href="${resetLink}" class="reset-btn">Reset Password</a>
      <p>This link is valid for the next 15 minutes. After that, you will need to request another password reset.</p>
      <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@example.com" class="support-link">support@example.com</a>.</p>
      <p>Thank you,</p>
    </div>
  </body>
  
  </html>
  
  `);
};
