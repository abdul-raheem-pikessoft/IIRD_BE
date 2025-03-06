import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadAtDriveService {
  static async uploadFile(file: any, uploadDir: string): Promise<string> {
    try {
      const fileName = file.originalname;
      const filePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.writeFileSync(filePath, file.buffer);
      return filePath;
    } catch (e) {
      throw new HttpException({ message: e.message }, HttpStatus.BAD_REQUEST);
    }
  }
}
