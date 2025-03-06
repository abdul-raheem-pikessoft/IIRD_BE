import { Module } from '@nestjs/common';
import { UserTokensService } from './user-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserToken } from './entities/user-tokens.entity';
import { UserTokenRepository } from './user-tokens.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserToken])],
  providers: [UserTokensService, UserTokenRepository],
  exports: [UserTokensService, UserTokenRepository],
})
export class UserTokensModule {}
