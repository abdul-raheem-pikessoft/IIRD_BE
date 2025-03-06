import { config } from 'dotenv';
import { Client } from 'node-mailjet';
import { UnhandledException } from '../../exceptions/custom-exception';
import { IEmailService } from '../../interfaces';

config();
export class MailJetService implements IEmailService {
  client: Client = new Client({
    apiKey: process.env.MAILJET_KEY,
    apiSecret: process.env.MAILJET_SECRET,
  });

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      const params = {
        Messages: [
          {
            From: { Email: process.env.ADMIN_EMAIL },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: body,
          },
        ],
      };
      await this.client.post('send', { version: 'v3.1' }).request(params);
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }
}
