import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  notificationType: string;

  @ApiProperty()
  userId: number;
}
