import { Controller, Post } from '@nestjs/common';
import { LambdaService } from './lambda.service';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { NoAuth } from "../auth/strategy/no-auth.guard";

@ApiBearerAuth()
@ApiTags('Lambda')

@Controller('lambda')
export class LambdaController {
  constructor(private readonly lambdaService: LambdaService) {}

  @NoAuth()
  @Post('resume-parser')
  resumeParse() {
    return this.lambdaService.resumeParse();
  }
}
