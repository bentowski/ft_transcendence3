import { Controller, Get, Param } from '@nestjs/common';
import { AvailableChanService } from './available-chan.service';

@Controller('available-chan')
export class AvailableChanController {
    constructor(private readonly availableChanService: AvailableChanService ) {}

    @Get(':name')
    findOneChan(@Param('name') name: string) {
        return (this.availableChanService.findOneChan(name));
    }

    @Get()
    findAllAvailableChannel(): any[] {
        return this.availableChanService.findAllAvailableChannel();
    }
}
