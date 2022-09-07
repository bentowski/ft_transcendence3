import { Controller, Get } from '@nestjs/common';
import { FirstRouteService } from './first-route.service';

@Controller('first-route')
export class FirstRouteController {
  constructor(private readonly firstRouteController: FirstRouteService) {}

  @Get()
  getHello(): string {
    return this.firstRouteController.getHello();
  }
}
