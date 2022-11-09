import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import { ChanService } from "./chan.service";
import { CreateChanDto } from "./dto/create-chan.dto";
import {AuthGuard} from "@nestjs/passport";
import {UserAuthGuard} from "../auth/guards/user-auth.guard";
import UserEntity from "../user/entities/user-entity";

@Controller('chan')
//@UseGuards(AuthGuard('jwt'), UserAuthGuard)
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

    @Get(' :id/banned')
    getBanned(@Param('id') idroom: string): Promise<UserEntity[]> {
        return this.chanService.getBanned(idroom);
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
