import { Injectable } from '@nestjs/common';
import { EmailService } from '../mail-providers/index';
import { IPUnblockInformation } from '../templates/unblock-ip.template';

@Injectable()
export class FilterIPMailer {
  constructor(private readonly emailService: EmailService) {}

  IPUnblockInformation(ips: any) {
    const subject = 'IP Unblocking Notification';
    const body = IPUnblockInformation(ips);
    return this.emailService.sendEmail(process.env.ADMIN_EMAIL, subject, body);
  }
}
