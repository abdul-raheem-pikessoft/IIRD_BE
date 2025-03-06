import { Module } from '@nestjs/common';
import { EmailService } from './mail-providers';
import { FilterIPMailer } from './services/filter-ip-mailer.service';
import { UserMailer } from './services/user-mailer.service';

@Module({
  providers: [EmailService, FilterIPMailer, UserMailer],
  exports: [FilterIPMailer, UserMailer],
})
export class EmailModule {}
