import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  Post,
  Req,
  UploadedFiles,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Delete,
  Body,
  HttpException,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { File } from './entities/file.entity';
import { User } from '../users/entities/user.entity';
import { DeleteFileDto } from './dto/delete-file.dto';
import { MessageResponse } from '../../../types/response.type';
import { Exception, UnhandledException } from '../../../exceptions/custom-exception';

@ApiBearerAuth()
@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(HttpStatus.OK)
  @Post('upload')
  async uploadFile(@UploadedFiles() files: Express.Multer.File, @Req() req: Request): Promise<File> {
    try {
      const user: User = req?.user as User;

      return await this.filesService.uploadFile(files, user?.id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findFile(@Param('id', new ParseIntPipe()) id: number): Promise<File> {
    try {
      return await this.filesService.findFile(id);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async removeFile(@Param('id', new ParseIntPipe()) id: number, @Body() body: DeleteFileDto): Promise<MessageResponse> {
    try {
      return await this.filesService.deleteFile(id, body);
    } catch (err) {
      if (err instanceof UnhandledException || !(err instanceof Exception)) {
        throw new HttpException({ message: err?.message }, HttpStatus.BAD_REQUEST);
      }

      throw new Exception(err?.message, err?.status);
    }
  }
}
