import { Test, TestingModule } from '@nestjs/testing';
import { AvailableChanController } from './available-chan.controller';

describe('AvailableChanController', () => {
  let controller: AvailableChanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableChanController],
    }).compile();

    controller = module.get<AvailableChanController>(AvailableChanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
