import {BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import { ChanService } from "./chan.service";
import { CreateChanDto } from "./dto/create-chan.dto";
import {AuthGuard} from "@nestjs/passport";
import {UserAuthGuard} from "../auth/guards/user-auth.guard";
import UserEntity from "../user/entities/user-entity";

@Controller('chan')
@UseGuards(AuthGuard('jwt'), UserAuthGuard)
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

    @Get(':id/banned')
    getBanned(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getBanned(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':id/isbanned')
    async isBanned(@Param('id') idroom: string,
             @Body() obj): Promise<boolean> {
        const chan = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new BadRequestException('Error while checking user status: Cant find chan');
        }
        for (let index = 0; index < chan.banUser.length; index++) {
            if (obj.auth_id === chan.banUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    /*
    @Patch(':id/ban')
    async banUnBan(@Param('id') idroom: string,
                   @Body() obj) {
        try {
            return this.chanService.banUserToChannel(obj.auth_id, idroom);
        } catch (error) {
            throw new Error(error);
        }
    }
     */

    @Get(':id/ismuted')
    async isMuted(@Param('id') idroom: string,
                  @Body() obj): Promise<boolean> {
        const chan = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new BadRequestException('Error while checking user status: Cant find chan');
        }
        for (let index = 0; index < chan.muteUser.length; index++) {
            if (obj.auth_id === chan.muteUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    @Get(':id/muted')
    getMuted(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getMuted(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':id/user')
    getUsers(@Param('id') idroom: string): Promise<UserEntity[]> {
        //console.log('param = ', idroom);
        try {
            return this.chanService.getUsers(idroom);
        } catch (error) {
            throw new Error(error);
        }
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
