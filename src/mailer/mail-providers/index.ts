import { Injectable, Logger } from '@nestjs/common';
import { EmailServiceEnum } from '../../enums/global.enum';
import { IEmailService } from '../../interfaces';
import { MailJetService } from './mailjet.service';
import { NodeMailerService } from './nodemailer.service';
import { SendGridService } from './sendgrid.service';

@Injectable()
export class EmailService {
  private emailService: IEmailService;

  constructor() {
    switch (process.env.EMAIL_SERVICE) {
      case EmailServiceEnum.NODEMAILER:
        this.emailService = new NodeMailerService();
        break;
      case EmailServiceEnum.MAILJET:
        this.emailService = new MailJetService();
        break;
      case EmailServiceEnum.SENDGRID:
        this.emailService = new SendGridService();
        break;
      default:
        throw new Error('Invalid or missing EMAIL_SERVICE in env');
    }
    Logger.log(`Email Service Initialized: ${process.env.EMAIL_SERVICE?.toUpperCase()}`, EmailService.name);
  }

  sendEmail(to: string, subject: string, body: string): Promise<void> {
    return this.emailService.sendEmail(to, subject, body);
  }
}
