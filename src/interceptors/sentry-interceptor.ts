import { ExecutionContext, Injectable, NestInterceptor, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as Sentry from '@sentry/node';
import { Exception } from 'src/exceptions/custom-exception';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    let body;
    if (req.body.password) {
      body = { ...req.body, password: '*********' };
    } else {
      body = req.body;
    }
    return next.handle().pipe(
      tap(null, (exception: Exception) => {
        if (exception instanceof HttpException) {
          const transaction = Sentry.startTransaction({
            name: `${method} ${url} ${Date.now() - now} ms`,
            op: JSON.stringify(body),
          });
          // Note that we set the transaction as the span on the scope.
          // This step makes sure that if an error happens during the lifetime of the transaction
          // the transaction context will be attached to the error event
          Sentry.configureScope((scope) => {
            scope.setSpan(transaction);
          });
          Sentry.captureException(exception);
          transaction.finish();
        }
      }),
    );
  }
}
