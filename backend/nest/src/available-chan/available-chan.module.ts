import { Module } from '@nestjs/common';
import { AvailableChanController } from './available-chan.controller';
import { AvailableChanService } from './available-chan.service';

@Module({
  controllers: [AvailableChanController],
  providers: [AvailableChanService]
})
export class AvailableChanModule {}
