import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChanService } from "./chan.service";
import { CreateChanDto } from "./dto/create-chan.dto";

@Controller('chan')
export class ChanController {
    constructor(private readonly chanService: ChanService) {}

    @Get()
    getChans() { return this.chanService.findAll(); }

    @Get(':id')
    findOne(@Param('id') username: string) {
        return this.chanService.findOne(username);
    }

    @Get('/id/:id')
    findOnebyID(@Param('id') id: string) {
        return this.chanService.findOnebyID(id);
    }

    @Post('create')
    createChan(@Body() createUserDto: CreateChanDto) {
        return this.chanService.createChan(createUserDto);
    }

    @Delete(':id')
    remove(@Param('id') username: string) {
        return this.chanService.remove(username);
    }

	@Post('chanchat')
	tryChan(@Body() test: any) {
		return this.chanService.addMessage(test);
	}
}
