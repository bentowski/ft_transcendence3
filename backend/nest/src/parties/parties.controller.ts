import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { CreatePartiesDto } from './dto/create-parties.dto';
import { HistorySavePartiesDto } from "./dto/history-save-parties.dto";
import { HistoryEntity } from './entities/history-entity';

@Controller('parties')
export class PartiesController {
    constructor(private readonly partiesService: PartiesService) { }

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

    @Delete(':id')
    remove(@Param('id') username: string) {
        return this.partiesService.remove(username);
    }

    @Get('histories')
    getHistories() {
        return (this.partiesService.findHistories());
    }

    @Post('histories/create')
    createHistories(@Body() historySavePartiesDto: HistorySavePartiesDto) {
        return this.partiesService.createHistories(historySavePartiesDto);
    }

    @Delete('histories/:id')
    removeHistories(@Param('id') username: string) {
        return this.partiesService.remove(username);
    }
}
