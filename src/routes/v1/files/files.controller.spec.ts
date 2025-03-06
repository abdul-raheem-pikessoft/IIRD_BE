import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { Mocked } from 'src/types/test.type';
import { Request } from 'express';
import { File } from './entities/file.entity';
import { HttpException } from '@nestjs/common';
import { MessageResponse } from '../../../types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { Exception, NotFoundException } from '../../../exceptions/custom-exception';
import { ExceptionMessageConstant } from '../../../../constant/exception-message.constant';
describe('FilesController', () => {
  let controller: FilesController;
  let mockFilesService: Mocked<FilesService>;
  let mockFile: File;
  let mockRequest: Request;
  let mockUploadedFile: Mocked<Express.Multer.File>;

  beforeEach((): void => {
    mockFile = {
      key: 'sampleKey123',
      originalName: 'example-image.png',
      mimetype: 'image/png',
      filePath: '/path/to/file',
      userId: 1,
    } as File;

    mockRequest = { user: { id: 1 } } as unknown as Request;
    mockUploadedFile = {} as unknown as Express.Multer.File;
  });

  beforeEach(async () => {
    mockFilesService = {
      createFile: jest.fn(),
      uploadFile: jest.fn(),
      findFile: jest.fn(),
      deleteFile: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Upload File', (): void => {
    it('Should upload a new File', async (): Promise<void> => {
      mockFilesService.uploadFile.mockResolvedValue(mockFile);
      const res: File = await controller.uploadFile(mockUploadedFile, mockRequest);

      expect(res).toStrictEqual(mockFile);
    });

    it('Should throw HttpException for unhandled exceptions', (): void => {
      mockFilesService.uploadFile.mockRejectedValue(new Error('unhandled error'));

      expect(controller.uploadFile(mockUploadedFile, mockRequest)).rejects.toThrow(HttpException);
    });
  });

  describe('Delete File', (): void => {
    it('Should delete uploaded File', async (): Promise<void> => {
      const expectedResponse: MessageResponse = { message: ResponseMessageConstant.FILE_DELETED };
      mockFilesService.deleteFile.mockResolvedValue(expectedResponse);
      const res: MessageResponse = await controller.removeFile(1, { key: 'sampleKey123' });

      expect(res).toStrictEqual(expectedResponse);
    });

    it('Should throw NotFound Exception if no file is found', (): void => {
      mockFilesService.deleteFile.mockRejectedValue(new NotFoundException(ExceptionMessageConstant.FILE_NOT_FOUND));

      expect(controller.removeFile(1, { key: 'sampleKey123' })).rejects.toThrow(Exception);
    });

    it('Should throw HttpException for unhandled exceptions', (): void => {
      mockFilesService.deleteFile.mockRejectedValue(new Error('unhandled error'));

      expect(controller.removeFile(1, { key: 'sampleKey123' })).rejects.toThrow(HttpException);
    });
  });
});
