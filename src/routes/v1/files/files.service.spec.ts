import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { FileRepository } from './file.repository';
import { Mocked } from 'src/types/test.type';
import { File } from './entities/file.entity';
import { FileUploadService } from '../../../aws/file-upload.service';
import { UnhandledException, NotFoundException } from '../../../exceptions/custom-exception';
import { DeleteResult } from 'typeorm';
import { MessageResponse } from '../../../types/response.type';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';

describe('FilesService', () => {
  let mockFileRepository: Mocked<FileRepository>;
  let service: FilesService;
  let mockFile: File;
  let mockUploadedFile: Mocked<Express.Multer.File>;
  const mockUrl: jest.Mock = jest.fn();
  const mockDeletionFromS3: jest.Mock = jest.fn();

  beforeEach((): void => {
    mockFile = {
      key: 'sampleKey123',
      originalName: 'example-image.png',
      mimetype: 'image/png',
      filePath: '/path/to/file',
      userId: 1,
    } as File;

    mockUploadedFile = {
      originalname: 'example-image.png',
      mimetype: 'image/png',
    } as Mocked<Express.Multer.File>;

    FileUploadService.upload = mockUrl;
    FileUploadService.delete = mockDeletionFromS3;
  });

  beforeEach(async () => {
    mockFileRepository = {
      saveFile: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: FileRepository,
          useValue: mockFileRepository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Upload File', (): void => {
    it('Should upload a file', async (): Promise<void> => {
      mockFileRepository.saveFile.mockResolvedValue(mockFile);
      const res: File = await service.uploadFile(mockUploadedFile, 1);

      expect(res).toStrictEqual(mockFile);
    });

    it('Should throw UnhandledException for unhandled exceptions', (): void => {
      mockFileRepository.saveFile.mockRejectedValue(new Error('unhandled error'));

      expect(service.uploadFile(mockUploadedFile, 1)).rejects.toThrow(UnhandledException);
    });
  });

  describe('Create File', (): void => {
    it('it should save the file', async (): Promise<void> => {
      mockFileRepository.saveFile.mockResolvedValue(mockFile);
      const response: File = await service.createFile(mockFile, 1, mockFile.filePath);
      expect(response).toStrictEqual(mockFile);
    });

    it('should throw Unhandled Exception in case of exception', (): void => {
      mockFileRepository.saveFile.mockRejectedValue(new Error('unhandled error'));
      expect(service.createFile(mockFile, 1, mockFile.filePath)).rejects.toThrow(UnhandledException);
    });

    describe('Get File ', (): void => {
      it('it should get the file', async (): Promise<void> => {
        mockFileRepository.findOne.mockResolvedValue(mockFile);
        const response: File = await service.findFile(mockFile.id);
        expect(response).toStrictEqual(mockFile);
      });

      it('Should throw NotFound Exception if no file is found', (): void => {
        mockFileRepository.findOne.mockResolvedValue(null);

        expect(service.findFile(1)).rejects.toThrow(NotFoundException);
      });

      it('should throw Unhandled Exception in case of Exception', (): void => {
        mockFileRepository.findOne.mockRejectedValue(new Error('unhandled error'));
        expect(service.findFile(mockFile.id)).rejects.toThrow(UnhandledException);
      });
    });

    describe('Delete File', (): void => {
      it('Should delete a file from database, if it is deleted from S3', async (): Promise<void> => {
        mockFileRepository.findOne.mockResolvedValue(mockFile);
        mockFileRepository.delete.mockResolvedValue({} as DeleteResult);
        (FileUploadService.delete as jest.Mock).mockResolvedValue(true);
        const expectedResponse: MessageResponse = { message: ResponseMessageConstant.FILE_DELETED };
        const res: MessageResponse = await service.deleteFile(1, { key: 'sampleKey123' });

        expect(res).toStrictEqual(expectedResponse);
      });

      it('Should not delete a file from database, if it is not deleted from S3', (): void => {
        mockFileRepository.findOne.mockResolvedValue(null);
        (FileUploadService.delete as jest.Mock).mockResolvedValue(false);

        expect(service.deleteFile(1, { key: 'sampleKey123' })).rejects.toThrow(NotFoundException);
      });

      it('Should throw NotFound Exception if no file is found', (): void => {
        mockFileRepository.findOne.mockResolvedValue(null);

        expect(service.deleteFile(1, { key: 'sampleKey123' })).rejects.toThrow(NotFoundException);
      });

      it('Should throw UnhandledException for unhandled exceptions', (): void => {
        mockFileRepository.findOne.mockRejectedValue(new Error('unhandled error'));

        expect(service.deleteFile(1, { key: 'sampleKey123' })).rejects.toThrow(UnhandledException);
      });
    });
  });
});
