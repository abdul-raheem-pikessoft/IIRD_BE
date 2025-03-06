import { User } from 'src/routes/v1/users/entities/user.entity';
import { Layout } from '../layouts/layout.template';
import * as dotenv from 'dotenv';

dotenv.config();

export const RegistrationTemplate = (user: User) => {
  return Layout(`
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Confirmation</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
          }
  
          .container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background-color: #fff;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
  
          .header {
              padding: 30px;
              text-align: center;
              background-color: #3498db;
              color: #fff;
              margin: 0;
          }
  
          .content {
              padding: 30px;
              background-color: #ecf0f1;
          }
  
          p {
              font-size: 16px;
              line-height: 1.6;
              color: #333;
              margin: 0;
          }
  
          a.button {
              display: inline-block;
              padding: 15px 30px;
              background-color: #3498db;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
          }
  
          a.button:hover {
              background-color: #2980b9;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <div class="header">
              <h1 class="header">Account Confirmation</h1>
          </div>
          <div class="content">
              <p>Hello ${user?.name},</p>
              <p>Thank you for signing up with us!</p>
              <p>To activate your account, please click the confirmation link below:</p>
              <p><a href="${
                process.env.VERIFY_EMAIL_LINK + '?email=' + encodeURIComponent(user?.email)
              }" class="button">Confirm Account</a></p>
              <p>If you did not initiate this signup, you can ignore this email.</p>
              <p>Best regards,<br>Pikessoft</p>
          </div>
      </div>
  </body>
  
  </html>
  `);
};
