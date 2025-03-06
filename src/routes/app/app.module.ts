import { HttpModule } from '@nestjs/axios';
import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import path from 'path';
import { FilterIPGuard } from 'src/guards/filter-ip.guard';
import { RateLimiterByReqMethod } from 'src/guards/method-based-limiter.guard';
import { RateLimiterByUserRoleAndId } from 'src/guards/role-based-limiter.guard';
import { RolesPermissionsGuard } from 'src/guards/role-permissions.guard';
import { I18nInterceptor } from 'src/interceptors/i18n.intercetor';
import { InputSanitizationMiddleware } from 'src/middlewares/input-sanitization.middleware';
import { dataSourceOptions } from '../../config/db/database';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { AuthModule } from '../v1/auth/auth.module';
import { JwtAccessTokenStrategy } from '../v1/auth/strategy/jwt-access-token-strategy.service';
import { JwtAuthGuard } from '../v1/auth/strategy/jwt-auth-guard';
import { JwtRefreshTokenStrategy } from '../v1/auth/strategy/jwt-refresh-token-strategy.service';
import { FilesModule } from '../v1/files/files.module';
import { IpModule } from '../v1/filter-ip/filter-ip.module';
import { MessageModule } from '../v1/message/message.module';
import { NotificationModule } from '../v1/notification/notification.module';
import { PermissionsModule } from '../v1/permissions/permissions.module';
import { RolePermissionModule } from '../v1/role-permission/role-permission.module';
import { RoleModule } from '../v1/role/role.module';
import { UserRolePermissionModule } from '../v1/user-role-permission/user-role-permission.module';
import { UserTokensModule } from '../v1/user-tokens/user-tokens.module';
import { UserModule } from '../v1/users/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from '../../mailer/mailer.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join('src', 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      timeout: 600000,
    }),
    ThrottlerModule.forRoot(),
    PassportModule.register({ defaultStrategy: ['jwt'] }),
    TypeOrmModule.forRoot(dataSourceOptions),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionsModule,
    RolePermissionModule,
    UserRolePermissionModule,
    MessageModule,
    IpModule,
    NotificationModule,
    FilesModule,
    UserTokensModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: FilterIPGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimiterByReqMethod,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimiterByUserRoleAndId,
    },
    {
      provide: APP_GUARD,
      useClass: RolesPermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InputSanitizationMiddleware).forRoutes('*');
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
