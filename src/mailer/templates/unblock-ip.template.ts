import { Layout } from '../layouts/layout.template';
import dayjs from 'dayjs';

export const IPUnblockInformation = (ips: any): string => {
  return Layout(`
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <title>IP Unblocked Notification</title>
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
  
          h1 {
              color: #008000;
          }
  
          p {
              margin: 10px 0;
          }
  
          table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 15px;
          }
  
          th,
          td {
              border: 1px solid #000000;
              padding: 8px;
          }
      </style>
  </head>
  
  <body>
      <div class="container">
          <h1>IPs Information</h1>
          <p>Dear Administrator,</p>
          <p>The following IP addresses have been automatically unblocked after being blocked for more than two days:</p>
          <table>
              <tr>
                  <th>Block Date</th>
                  <th>IP</th>
              </tr>
              ${ips
                .map(
                  (ip: any) => `<tr><td>${dayjs(ip.createdAt)?.format('ddd, DD MMM YYYY HH:mm:ss [GMT]')}</td><td>${ip.address}</td></tr>`,
                )
                .join('')}
          </table>
          <p>Best regards,</p>
          <p>PikesSoft</p>
      </div>
  </body>
  </html>
  

`);
};
