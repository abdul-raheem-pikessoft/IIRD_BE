import { Test, TestingModule } from '@nestjs/testing';
import { LambdaController } from './lambda.controller';
import { LambdaService } from './lambda.service';

describe('LambdaController', () => {
  let controller: LambdaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LambdaController],
      providers: [LambdaService],
    }).compile();

    controller = module.get<LambdaController>(LambdaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
