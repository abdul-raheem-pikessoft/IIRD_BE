import { Injectable } from '@nestjs/common';
import { File } from './entities/file.entity';
import { FileRepository } from './file.repository';
import path from 'path';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { Exception, NotFoundException, UnhandledException } from '../../../exceptions/custom-exception';
import { FileUploadService } from '../../../aws/file-upload.service';
import { DeleteFileDto } from './dto/delete-file.dto';
import { MessageResponse } from 'src/types/response.type';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  async createFile(file: File, userId: number, filePath: string): Promise<File> {
    try {
      const userFile: File = new File();
      userFile.originalName = file?.originalName;
      userFile.userId = userId;
      userFile.mimetype = file?.mimetype;
      userFile.filePath = filePath;

      return await this.fileRepository.saveFile(userFile);
    } catch (error) {
      throw new UnhandledException(error?.message);
    }
  }

  async uploadFile(file: Express.Multer.File, userId: number): Promise<File> {
    try {
      const { name }: { name: string } = path.parse(file?.originalname);
      const mimetype: string = file?.mimetype?.split('/')?.[1];
      const urlKey: string = `${Date?.now()}-${name}.${mimetype}`;
      const url: string = await FileUploadService.upload(file, urlKey);
      const body: File = {
        key: urlKey,
        originalName: name,
        mimetype,
        filePath: url,
        userId,
      } as File;

      return await this.fileRepository.saveFile(body);
    } catch (error) {
      throw new UnhandledException(error?.message);
    }
  }

  async findFile(id: number): Promise<File> {
    try {
      const file: File = await this.fileRepository.findOne(id);

      if (file) {
        return file;
      }

      throw new NotFoundException(ExceptionMessageConstant.FILE_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }

  async deleteFile(id: number, body: DeleteFileDto): Promise<MessageResponse> {
    try {
      const file: File = await this.fileRepository.findOne(id);

      if (file) {
        const isDeletedFromS3: boolean = await FileUploadService.delete(body?.key);

        if (isDeletedFromS3) {
          await this.fileRepository.delete(id);
          return { message: ResponseMessageConstant?.FILE_DELETED };
        }
      }

      throw new NotFoundException(ExceptionMessageConstant.FILE_NOT_FOUND);
    } catch (err) {
      if (!(err instanceof Exception)) {
        throw new UnhandledException(err?.message);
      }

      throw err;
    }
  }
}
