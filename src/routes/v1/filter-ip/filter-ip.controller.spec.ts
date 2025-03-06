import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponseMessageConstant } from '../../../../constant/response-message.constant';
import { FilterIP } from './entities/filter-ip.entity';
import { IPController } from './filter-ip.controller';
import { IPService } from './filter-ip.service';

type Mocked<T> = jest.MockedObject<Partial<T>>;

describe('IpController', () => {
  let controller: IPController;
  let mockService: Mocked<IPService>;
  let mockResponse: any;
  const mockIP = {
    id: 1,
    address: '127.0.0.1',
    isBlocked: true,
    permanentlyBlocked: true,
  } as FilterIP;

  beforeEach(async () => {
    mockService = {
      addIPToBlacklist: jest.fn(),
      addIPToWhitelist: jest.fn(),
      getAll: jest.fn(),
    } as Mocked<IPService>;

    mockResponse = {
      status: jest.fn().mockImplementation((status) => {
        mockResponse.status = status;
        return mockResponse;
      }),
      json: jest.fn().mockImplementation((content) => ({ status: mockResponse.status, content })),
    } as unknown as Response;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IPController],
      providers: [
        {
          provide: IPService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IPController>(IPController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Add IP to Blacklist', () => {
    it('Should add an IP address to the blacklist', async () => {
      const expectedResponse = {
        status: HttpStatus.OK,
        content: {
          message: ResponseMessageConstant.IP_BLACKLISTED,
        },
      };
      mockService.addIPToBlacklist.mockResolvedValue(expectedResponse);
      const response = await controller.addIPtoBlackList({ ...mockIP, ipAddress: mockIP.address }, mockResponse);
      expect(response).toStrictEqual(expectedResponse);
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
      mockService.addIPToWhitelist.mockResolvedValue(expectedResponse);
      const response = await controller.addIPtoWhiteList({ ...mockIP, ipAddress: mockIP.address }, mockResponse);
      expect(response).toStrictEqual(expectedResponse);
    });
  });

  describe('Get All IPs', () => {
    it('Should return all IPs with given parameters', async () => {
      const expectedResponse = {
        status: HttpStatus.OK,
        content: {
          records: [mockIP],
          count: 1,
        },
      };
      mockService.getAll.mockResolvedValue(expectedResponse);
      const response = await controller.getAllIPs(true, false, 1, 0);
      expect(response).toStrictEqual(expectedResponse.content);
    });
  });
});
