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
    async createChan(@Body() createUserDto: CreateChanDto) {
        let ret = await this.chanService.createChan(createUserDto);
        console.log("DONe : ", ret)
        return ret
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
