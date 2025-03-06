import { Test, TestingModule } from '@nestjs/testing';
import { IPService } from './filter-ip.service';
import { IPRepository } from './filter-ip.repository';
import { FilterIP } from './entities/filter-ip.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { FilterIPMailer } from '../../../mailer/services/filter-ip-mailer.service';

type Mocked<T> = jest.MockedObject<Partial<T>>;
describe('IpService', () => {
  let service: IPService;
  let mockRepository: Mocked<IPRepository>;
  let mockFilterIPMailerService: Mocked<FilterIPMailer>;

  const mockIP = {
    id: 1,
    address: '127.0.0.1',
    isBlocked: true,
    permanentlyBlocked: true,
  } as FilterIP;

  beforeEach(async () => {
    mockRepository = {
      saveIP: jest.fn(),
      findAll: jest.fn(),
      findOneByProp: jest.fn(),
      removeAllExpiredIPs: jest.fn(),
    } as Mocked<IPRepository>;

    mockFilterIPMailerService = {
      IPUnblockInformation: jest.fn(),
    } as Mocked<FilterIPMailer>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IPService,
        { provide: IPRepository, useValue: mockRepository },
        {
          provide: FilterIPMailer,
          useValue: mockFilterIPMailerService,
        },
      ],
    }).compile();

    service = module.get<IPService>(IPService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Add IP to Blacklist', () => {
    it('Should add an IP address to the blacklist temporarily', async () => {
      const expectedResponse = {
        status: HttpStatus.OK,
        content: {
          message: ResponseMessageConstant.IP_BLACKLISTED,
        },
      };
      const response = await service.addIPToBlacklist(mockIP.address, false);
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should add an IP address to the blacklist permanently', async () => {
      const expectedResponse = {
        status: HttpStatus.OK,
        content: {
          message: ResponseMessageConstant.IP_BLACKLISTED,
        },
      };
      const response = await service.addIPToBlacklist(mockIP.address, true);
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', () => {
      expect(service.addIPToBlacklist).rejects.toThrow(HttpException);
    });
  });

  describe('Add IP to Whitelist', () => {
    it('Should add an IP address to the whitelist', async () => {
      const expectedResponse = {
        status: HttpStatus.OK,
        content: {
          message: ResponseMessageConstant.IP_WHITELISTED,
        },
      };
      const response = await service.addIPToWhitelist(mockIP.address);
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', () => {
      expect(service.addIPToWhitelist).rejects.toThrow(HttpException);
    });
  });

  describe('Get All IPs', () => {
    it('Should return all IPs with given parameters', async () => {
      mockRepository.findAll.mockResolvedValue([[mockIP], 1]);
      const response = await service.getAll({ take: 1, skip: 0, isBlocked: true });
      const expectedResponse = {
        status: HttpStatus.OK,
        content: {
          records: [mockIP],
          count: 1,
        },
      };
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', () => {
      expect(service.getAll).rejects.toThrow(HttpException);
    });
  });

  describe('Check IP Status', () => {
    it('Should return an IP info against given address', async () => {
      mockRepository.findOneByProp.mockResolvedValue(mockIP);
      const response = await service.findByIPAddress(mockIP.address);
      const expectedResponse = {
        status: HttpStatus.OK,
        content: mockIP,
      };
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should return NotFound if no ip found against given address', async () => {
      mockRepository.findOneByProp.mockResolvedValue(null);
      const response = await service.findByIPAddress(mockIP.address);
      const expectedResponse = {
        status: HttpStatus.NOT_FOUND,
        content: null,
      };
      expect(response).toStrictEqual(expectedResponse);
    });

    it('Should be able to handle exceptions', () => {
      expect(service.findByIPAddress).rejects.toThrow(HttpException);
    });
  });

  describe('Remove IPs if they are expired', () => {
    it('Should remove IPs that have been expired', async () => {
      mockRepository.removeAllExpiredIPs.mockResolvedValue({ affected: 1, raw: [mockIP] });
      await service.unblockIPs();

      expect(mockRepository.removeAllExpiredIPs).toHaveReturned();
    });

    it('Should be able to handle exceptions', () => {
      expect(service.unblockIPs).rejects.toThrow(HttpException);
    });
  });
});
