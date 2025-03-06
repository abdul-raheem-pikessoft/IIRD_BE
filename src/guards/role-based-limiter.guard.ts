import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExceptionMessageConstant } from 'constant/exception-message.constant';
import { REQ_RATE_LIMITING_BY_ROLE } from 'constant/rate-limiting.constant';
import { User } from '../routes/v1/users/entities/user.entity';

@Injectable()
export class RateLimiterByUserRoleAndId extends ThrottlerGuard {
  protected async handleRequest(context: ExecutionContext): Promise<boolean> {
    let req, res, user;
    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      res = context.switchToHttp().getResponse();
    }
    if (!req.ipWhitelisted) {
      this.errorMessage = ExceptionMessageConstant.TOO_MANY_REQUESTS;
      if (context.getType() === 'http') user = context.switchToHttp().getRequest().user as User;

      const roleRateLimiter = user ? REQ_RATE_LIMITING_BY_ROLE[user.role] : null;
      if (roleRateLimiter) {
        const { totalHits, timeToExpire } = await this.storageService.increment(`${user.id}`, roleRateLimiter.ttl);

        res.header('X-RateLimit-Limit', roleRateLimiter.limit);
        res.header('X-RateLimit-Remaining', Math.max(roleRateLimiter.limit - totalHits, 0));

        if (totalHits > roleRateLimiter.limit) {
          res.header('Retry-After', timeToExpire);
          this.throwThrottlingException(context);
        }
      }
    }
    return true;
  }
}
