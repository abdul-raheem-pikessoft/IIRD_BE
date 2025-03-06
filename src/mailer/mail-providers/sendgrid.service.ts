import client from '@sendgrid/mail';
import { UnhandledException } from '../../exceptions/custom-exception';
import { IEmailService } from '../../interfaces';

export class SendGridService implements IEmailService {
  constructor() {
    client.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await client.send({
        to,
        from: process.env.ADMIN_EMAIL,
        subject,
        html: body,
      });
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }
}
