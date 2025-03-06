import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectThrottlerStorage, ThrottlerException, ThrottlerStorage } from '@nestjs/throttler';
import { ExceptionMessageConstant } from 'constant/exception-message.constant';
import { REQ_RATE_LIMITING_BY_IP } from 'constant/rate-limiting.constant';
import { IPService } from 'src/routes/v1/filter-ip/filter-ip.service';

@Injectable()
export class FilterIPGuard implements CanActivate {
  constructor(private readonly ipService: IPService, @InjectThrottlerStorage() private readonly storage: ThrottlerStorage) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request, response;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest();
      response = context.switchToHttp().getResponse();
    }

    const clientIP = request.ip;
    const { status, content: ip } = await this.ipService.findByIPAddress(clientIP);

    if (status === HttpStatus.NOT_FOUND) {
      const { ttl, limit } = REQ_RATE_LIMITING_BY_IP;
      const { totalHits, timeToExpire } = await this.storage.increment(`${clientIP}`, ttl);

      response.header('X-RateLimit-Limit', limit);
      response.header('X-RateLimit-Remaining', Math.max(limit - totalHits, 0));

      if (totalHits > limit) {
        response.header('Retry-After', timeToExpire);
        throw new ThrottlerException(ExceptionMessageConstant.TOO_MANY_REQUESTS);
      }
    } else if (ip.isBlocked) {
      throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN);
    } else {
      request.ipWhitelisted = true;
    }

    return true;
  }
}
