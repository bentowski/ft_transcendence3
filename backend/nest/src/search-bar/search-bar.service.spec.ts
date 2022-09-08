import { Test, TestingModule } from '@nestjs/testing';
import { SearchBarService } from './search-bar.service';

describe('SearchBarService', () => {
  let service: SearchBarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchBarService],
    }).compile();

    service = module.get<SearchBarService>(SearchBarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
