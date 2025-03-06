import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExceptionMessageConstant } from 'constant/exception-message.constant';
import { REQ_RATE_LIMITING_BY_METHOD } from 'constant/rate-limiting.constant';
import { Request, Response } from 'express';
import { ThrottlerStorageType } from 'src/types/global.types';

@Injectable()
export class RateLimiterByReqMethod extends ThrottlerGuard {
  protected async handleRequest(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    if (!req['ipWhitelisted']) {
      this.errorMessage = ExceptionMessageConstant.TOO_MANY_REQUESTS;
      const methodsRateLimiter = REQ_RATE_LIMITING_BY_METHOD[req.method];
      const { totalHits, timeToExpire }: ThrottlerStorageType = await this.storageService.increment(
        methodsRateLimiter.name,
        methodsRateLimiter.ttl,
      );

      res.header('X-RateLimit-Limit', methodsRateLimiter.limit);
      res.header('X-RateLimit-Remaining', Math.max(methodsRateLimiter.limit - totalHits, 0)?.toString());

      if (totalHits > methodsRateLimiter.limit) {
        res.header('Retry-After', timeToExpire?.toString());
        this.throwThrottlingException(context);
      }
    }
    return true;
  }
}
