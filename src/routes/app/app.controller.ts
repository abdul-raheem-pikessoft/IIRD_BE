import { Body, Controller, Get, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health-check')
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Get('/echo')
  getEcho(@Req() req: any, @Res() res: any, @Body() body: any) {
    res.status(200).json(body);
  }

  @Get('/premium-echo')
  getPremiumEcho(@Req() req: any, @Res() res: any, @Body() body: any) {
    res.status(200).json(body);
  }
}
