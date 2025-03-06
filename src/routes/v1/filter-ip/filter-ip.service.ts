import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { IPRepository } from './filter-ip.repository';
import { DeleteResult } from 'typeorm';
import { FilterIPMailer } from '../../../mailer/services/filter-ip-mailer.service';

@Injectable()
export class IPService {
  constructor(private readonly filterIPRepository: IPRepository, private readonly filterIPMailer: FilterIPMailer) {}

  async addIPToBlacklist(address: string, permanentlyBlocked: boolean) {
    try {
      let blockedUntil = null;
      if (!permanentlyBlocked) {
        blockedUntil = new Date();
        blockedUntil.setDate(blockedUntil.getDate() + +process.env.IP_BLOCKED_TIME);
      }
      await this.filterIPRepository.saveIP({ address, blockedUntil, permanentlyBlocked });
      return { status: HttpStatus.OK, content: { message: ResponseMessageConstant.IP_BLACKLISTED } };
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async addIPToWhitelist(address: string) {
    try {
      await this.filterIPRepository.saveIP({ address, isBlocked: false });
      return { status: HttpStatus.OK, content: { message: ResponseMessageConstant.IP_WHITELISTED } };
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async getAll(queryParams: any) {
    try {
      const [ips, count] = await this.filterIPRepository.findAll(queryParams);
      return { status: HttpStatus.OK, content: { count, records: ips } };
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async findByIPAddress(address: string) {
    try {
      const ip = await this.filterIPRepository.findOneByProp({ address });
      if (!ip) {
        return { status: HttpStatus.NOT_FOUND, content: ip };
      }

      return { status: HttpStatus.OK, content: ip };
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async unblockIPs() {
    try {
      const response: DeleteResult = await this.filterIPRepository.removeAllExpiredIPs();
      if (response.affected > 0) {
        await this.filterIPMailer.IPUnblockInformation(response.raw);
      }
      Logger.log('Unblocked IPs that had been expired');
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }
}
