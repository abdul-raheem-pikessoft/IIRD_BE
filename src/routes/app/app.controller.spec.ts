import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from '../v1/auth/auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AppController', () => {
  let appController: AppController;
  let mockAuthService = {};
  let mockAppService: jest.MockedObject<Partial<AppService>>;

  beforeEach(async () => {
    mockAppService = {
      getHello: jest.fn(),
      healthCheck: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        AuthService,
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: CACHE_MANAGER,
          useValue: {},
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      mockAppService.getHello.mockReturnValue('Hello World!');
      expect(appController.getHello()).toStrictEqual('Hello World!');
    });

    it('should health check', () => {
      mockAppService.healthCheck.mockReturnValue('up');
      expect(appController.healthCheck()).toStrictEqual('up');
    });

    it('should return the request body', () => {
      const body = { message: 'Test' };
      const req = { body: { message: 'Test' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      appController.getEcho(req as any, res as any, body);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Test' });
    });

    it('should return the request body for admin role', () => {
      const body = { message: 'Premium Test' };
      const req = { body: { message: 'Premium Test' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      appController.getPremiumEcho(req as any, res as any, body);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Premium Test' });
    });
  });
});
