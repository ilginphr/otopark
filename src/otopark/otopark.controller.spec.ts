import { Test, TestingModule } from '@nestjs/testing';
import { OtoparkController } from './otopark.controller';
import { OtoparkService } from './otopark.service';

describe('OtoparkController', () => {
  let controller: OtoparkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtoparkController],
      providers: [OtoparkService],
    }).compile();

    controller = module.get<OtoparkController>(OtoparkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
