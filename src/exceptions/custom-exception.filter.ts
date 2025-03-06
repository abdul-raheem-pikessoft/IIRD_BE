import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { ExceptionMessageConstant } from '../../constant/exception-message.constant';
import { Exception } from './custom-exception';

@Catch()
export class CustomExceptionFilter  {
  catch(exception: any, host: ArgumentsHost) {
    if (host.getType() !== 'http') {
      return exception;
    }

    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    if (exception instanceof HttpException || exception instanceof Exception) {
      const status: number = exception?.getStatus();

      response.status(status).json({
        statusCode: status,
        message: exception?.message,
        path: request?.url,
      });
    } else {
      Logger.error(exception);

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ExceptionMessageConstant?.INTERNAL_SERVER_ERROR,
        path: request?.url,
      });
    }
  }

  getErrorMessage(exception: Exception | HttpException): string {
    const errorResponse: string | object = exception?.getResponse();
    const errorMessage: string = (errorResponse as typeof exception)?.message || exception?.message;

    return errorMessage;
  }
}
