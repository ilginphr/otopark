import { Test, TestingModule } from '@nestjs/testing';
import { OtoparkService } from './otopark.service';

describe('OtoparkService', () => {
  let service: OtoparkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtoparkService],
    }).compile();

    service = module.get<OtoparkService>(OtoparkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
