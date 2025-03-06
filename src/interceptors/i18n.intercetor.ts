import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { I18nService, I18nTranslation } from 'nestjs-i18n';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LanguageEnum } from 'src/enums/language.enum';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  constructor(private readonly i18nService: I18nService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request: Request = context.switchToHttp().getRequest();
    const acceptLanguage: string = request.headers['accept-language'];
    const lang: string = Object.values(LanguageEnum).includes(acceptLanguage as LanguageEnum)
      ? acceptLanguage
      : process.env.DEFAULT_LANGUAGE;

    const translations: I18nTranslation = this.i18nService.getTranslations();
    return next.handle().pipe(
      map((data): void => {
        if (data?.message) {
          if (Object(translations?.[lang])?.response?.hasOwnProperty(data?.message)) {
            data.message = this.i18nService.t(`response.${data?.message}`, { lang });
          }
        }
        return data;
      }),

      catchError((error) => {
        const errorMessages: string[] = error?.message?.split(',');
        const translatedMessages: string[] = [];

        for (const message of errorMessages) {
          if (Object(translations?.[lang])?.exception?.hasOwnProperty(message)) {
            translatedMessages.push(
              this.i18nService.t(`exception.${message}`, {
                lang,
                args: { remainingMinutes: error?.additionalArgs?.[0] },
              }),
            );
          } else if (Object(translations?.[lang])?.response?.hasOwnProperty(message)) {
            translatedMessages.push(
              this.i18nService.t(`response.${message}`, {
                lang,
                args: { remainingMinutes: error?.additionalArgs?.[0] },
              }),
            );
          } else if (Object(translations?.[lang])?.validation?.hasOwnProperty(message)) {
            translatedMessages.push(this.i18nService.t(`validation.${message}`, { lang }));
          } else {
            translatedMessages.push(message);
          }
        }

        if (translatedMessages?.length) {
          error.message = translatedMessages?.join(',');
        }

        return throwError(() => error);
      }),
    );
  }
}
