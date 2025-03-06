import { DeleteResult, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class FileRepository {
  constructor(@InjectRepository(File) private readonly repository: Repository<File>) {}

  saveFile(file: File): Promise<File> {
    return this.repository.save(file);
  }

  findOne(id: number): Promise<File> {
    return this.repository.findOne({ where: { id } });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.repository.delete({ id });
  }
}
