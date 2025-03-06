import { User } from 'src/routes/v1/users/entities/user.entity';
import { Layout } from '../layouts/layout.template';

export const SetPasswordTemplate = (user: Partial<User>, resetLink: string): string =>
  Layout(`<!DOCTYPE html>
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IP Unblocked Notification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
    }

    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      background-color: #0077b5;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      padding: 20px;
    }

    h1 {
      color: #ffffff;
      font-size: 24px;
      margin: 0;
    }

    .content {
      padding: 20px;
      background-color: #ffffff;
      border-radius: 0 0 5px 5px;
    }

    p {
      font-size: 16px;
      line-height: 1.6;
      color: #333;
      margin: 0 0 15px;
    }

    a.button {
      display: inline-block;
      background-color: #0077b5;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
    }

    a.button:hover {
      background-color: #005580;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0 0 15px;
    }

    li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <table class="table">
      <tr>
        <td class="header">
          <h1>Hi ${user?.name}</h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <p>We received an account recovery request on Nestjs Boilerplate for <strong>${user?.email}</strong>.</p>
          <p>This email address is associated with an account but no password is associated with it yet, so it can't be used to log in.</p>
          <p>If you initiated this request, please set a password by clicking the button below:</p>
          <p><a href="${resetLink}" class="button">Set Password</a></p>
          <p>You can also log in to your account using any of the following accounts:</p>
          <ul>
            ${user?.facebookSocialId ? `<li>Facebook: ${user?.email}</li>` : ''}
            ${user?.googleSocialId ? `<li>Google: ${user?.email}</li>` : ''}
          </ul>
          <p>Once logged in, you can review existing credentials. Simply visit your profile, click on Edit Profile & Settings, and My Logins.</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>

`);
