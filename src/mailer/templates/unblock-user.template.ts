import { Layout } from '../layouts/layout.template';

export const UnblockUserTemplate = (email: string, unblockLink: string): string => {
  return Layout(`
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <title>User Account Suspension Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f2f2f2;
          }
  
          .container {
              text-align: center;
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
  
          p {
              margin: 10px 0;
          }
  
          strong {
              color: #5A5CCD;
          }
  
          a.button {
              background-color: #5A5CCD;
              color: #ffffff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
          }
  
          a.button:hover {
              background-color: #4245a8;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <p>Dear user,</p>
          <p>We've noticed some suspicious actions on the account linked to the email address:</p>
          <p><strong>${email}</strong></p>
          <p>If these actions were not initiated by you, you can click the button below to unblock yourself.</p>
          <a href="${unblockLink}" class="button">Unlock Account</a>
          <p>This link remains valid for the next ${process.env.USER_UNBLOCK_LINK_EXPIRY} minutes. After this period, you'll need to wait for a specific duration before unlocking your account.</p>
          <p>If you have any queries or require assistance, please reach out to our support team at ${process.env.ADMIN_EMAIL}</p>
          <p>Thank you</p>
      </div>
  </body>
  
  </html>
  
`);
};
