import nodemailer, { Transporter } from 'nodemailer';
import { IEmailService } from '../../interfaces';
import { UnhandledException } from '../../exceptions/custom-exception';
import { config } from 'dotenv';

config();
export class NodeMailerService implements IEmailService {
  client: Transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.client.sendMail({
        from: process.env.ADMIN_EMAIL,
        to,
        subject,
        html: body,
      });
    } catch (err) {
      throw new UnhandledException(err?.message);
    }
  }
}
