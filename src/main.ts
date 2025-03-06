import { NestFactory } from '@nestjs/core';
import { AppModule } from './routes/app/app.module';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import * as tracing from '@sentry/tracing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomExceptionFilter } from './exceptions/custom-exception.filter';
import { Exception } from './exceptions/custom-exception';
import { AppHelperService } from './helpers/app.helper';
import { ValidationError } from 'class-validator';

async function bootstrap(): Promise<void> {
  const app: any = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.DISABLE_NEST_LOGS === 'true' ? false : new Logger(),
  });
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const message: string = AppHelperService.extractValidationMessage(errors)?.toString();
        throw new Exception(message);
      },
    }),
  );

  if (!process.env.ENABLE_GRAPHQL_PLAYGROUND) {
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            'object-src': 'none',
            'base-uri': 'self',
            'form-action': 'self',
          },
        },
      }),
    );
  }
  app.enableCors();
  app.setGlobalPrefix('api');

  Sentry.init({
    dsn: process.env.SENTRY_DSN_LINK,
    environment: process.env.NODE_ENV,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('nestjs boiler-plate')
    .addGlobalParameters({
      in: 'header',
      required: true,
      name: 'accept-language',
      schema: {
        example: 'en',
      },
    })
    .setDescription('Boilerplate for nestjs')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);

  Logger.log(`Server is Running ${await app.getUrl()}`);
}

bootstrap().then(() => console.info('Server is Running..........'));
