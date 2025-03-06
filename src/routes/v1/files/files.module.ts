import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { FileRepository } from './file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  exports: [FilesService, FileRepository],
  providers: [FilesService, FileRepository],
})
export class FilesModule {}
