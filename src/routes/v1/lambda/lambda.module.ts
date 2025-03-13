import { Module } from '@nestjs/common';
import { LambdaService } from './lambda.service';
import { LambdaController } from './lambda.controller';

@Module({
  controllers: [LambdaController],
  providers: [LambdaService]
})
export class LambdaModule {}
