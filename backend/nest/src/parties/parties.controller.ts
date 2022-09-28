import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartiesDto } from './dto/create-parties.dto';


@Controller('parties')
export class PartiesController {
    constructor(private readonly partiesService: PartiesService ) {}

    @Get(':name')
    findAllAvailableParties(@Param('name') name: string) {
        return (this.partiesService.findAllAvailableParties(name));
    }

    @Get()
    getParties() {
        return (this.partiesService.findParties());
    }

	@Post('create')
    createParties(@Body() createPartiesDto: CreatePartiesDto) {
        return this.partiesService.createPartiesEntity(createPartiesDto);
    }
}
