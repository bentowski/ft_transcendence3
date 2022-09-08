import { Controller, Get, Param, HostParam } from '@nestjs/common';
import { PartiesService } from './parties.service';

@Controller('search-bar/parties')
export class PartiesController {
    constructor(private readonly partiesService: PartiesService ) {}

    @Get(':name')
    findAllAvailableParties(@Param('name') name: string) {
        return (this.partiesService.findAllAvailableParties(name));
    }

    @Get()
    findAllParties() {
        return (this.partiesService.findAllParties());
    }
}
