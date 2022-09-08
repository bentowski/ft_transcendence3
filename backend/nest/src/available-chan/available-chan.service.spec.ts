import { Test, TestingModule } from '@nestjs/testing';
import { AvailableChanService } from './available-chan.service';

describe('AvailableChanService', () => {
  let service: AvailableChanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailableChanService],
    }).compile();

    service = module.get<AvailableChanService>(AvailableChanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
