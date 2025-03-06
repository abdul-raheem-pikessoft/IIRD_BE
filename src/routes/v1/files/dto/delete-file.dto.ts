import { IsString } from 'class-validator';

export class DeleteFileDto {
  @IsString()
  key: string;
}
