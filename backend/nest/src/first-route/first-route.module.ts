import { Module } from '@nestjs/common';
import { FirstRouteController } from './first-route.controller';
import { FirstRouteService } from './first-route.service';

@Module({
  controllers: [FirstRouteController],
  providers: [FirstRouteService]
})
export class FirstRouteModule {}
