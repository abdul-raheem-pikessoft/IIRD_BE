import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ChangeIPStatusDTO } from './dto/ip-status.dto';
import { IPService } from './filter-ip.service';
import { ControllerNameEnum } from '../../../enums/global.enum';

@ApiBearerAuth()
@ApiTags('IP')
@Controller(ControllerNameEnum.FILTER_IP)
export class IPController {
  constructor(private readonly ipService: IPService) {}

  @Post('/blacklist')
  @ApiOperation({ summary: 'Add an ip address to blacklist' })
  async addIPtoBlackList(@Body() body: ChangeIPStatusDTO, @Res() res: Response) {
    const response = await this.ipService.addIPToBlacklist(body.ipAddress, body.permanentlyBlocked);
    return res.status(response.status).json(response.content);
  }

  @Post('/whitelist')
  @ApiOperation({ summary: 'Add an ip address to the whitelist' })
  async addIPtoWhiteList(@Body() body: ChangeIPStatusDTO, @Res() res: Response) {
    const response = await this.ipService.addIPToWhitelist(body.ipAddress);
    return res.status(response.status).json(response.content);
  }

  @Get()
  @ApiOperation({ summary: 'Get all IPs' })
  @ApiQuery({ required: false, name: 'blocked' })
  @ApiQuery({ required: false, name: 'permanent' })
  @ApiQuery({ required: false, name: 'take' })
  @ApiQuery({ required: false, name: 'skip' })
  async getAllIPs(
    @Query('blocked') blocked: boolean,
    @Query('permanent') permanent: boolean,
    @Query('take') take: number,
    @Query('skip') skip: number,
  ) {
    const response = await this.ipService.getAll({ blocked, permanent, take, skip });
    return response.content;
  }
}
