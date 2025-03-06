import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '../../../logger/logger.module';
import { UserToken } from '../user-tokens/entities/user-tokens.entity';
import { UserTokenRepository } from '../user-tokens/user-tokens.repository';
import { UserTokensService } from '../user-tokens/user-tokens.service';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from '../../../mailer/mailer.module';

@Module({
  imports: [LoggerModule, JwtModule.register({}), forwardRef(() => UserModule), TypeOrmModule.forFeature([User, UserToken]), EmailModule],
  providers: [AuthService, UserTokensService, UserTokenRepository],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
