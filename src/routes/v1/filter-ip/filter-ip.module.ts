import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilterIP } from './entities/filter-ip.entity';
import { IPController } from './filter-ip.controller';
import { IPRepository } from './filter-ip.repository';
import { IPService } from './filter-ip.service';
import { EmailModule } from '../../../mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([FilterIP]), EmailModule],
  controllers: [IPController],
  providers: [IPService, IPRepository],
  exports: [IPService, IPRepository],
})
export class IpModule {}
