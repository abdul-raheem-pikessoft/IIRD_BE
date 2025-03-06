import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from 'src/routes/v1/users/entities/user.entity';
import { logger } from '../logger/winston.logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { statusCode } = response;
      if (statusCode === HttpStatus.TOO_MANY_REQUESTS) {
        this.logTooManyRequestResponse(response, req);
      } else {
        this.logResponse(response, req);
      }
    });
    next();
  }

  logTooManyRequestResponse(res: Response, req: Request): void {
    const msg = {
      date: new Date().toUTCString(),
      error: res.statusMessage,
      ip: req.ip,
      endpoint: req.originalUrl,
      userId: req.user ? (req.user as User).id : null,
    };
    logger.warn(msg);
  }

  logResponse(res: Response, req: Request): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const contentLength = res.get('content-length');
    let body = req.body;
    if (req.body.password) {
      body.password = '*********';
    }

    const resp = {
      url: `${method} ${originalUrl} ${ip} ${userAgent}`,
      request: {
        body,
        token: req.headers.authorization,
      },
      response: {
        status: res.statusCode,
        responseContentLength: contentLength,
      },
    };
    logger.info(resp);
  }
}
