import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIP, IsNotEmpty, IsOptional } from 'class-validator';

export class ChangeIPStatusDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsIP()
  ipAddress: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  permanentlyBlocked: boolean;
}
