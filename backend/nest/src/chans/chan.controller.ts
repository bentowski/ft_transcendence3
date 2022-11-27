import { NotFoundException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import { ChanService } from "./chan.service";
import { CreateChanDto } from "./dto/create-chan.dto";
import { CreatePrivChanDto } from "./dto/test.dto"
import {AuthGuard } from "@nestjs/passport";
import { UserAuthGuard } from "../auth/guards/user-auth.guard";
import UserEntity from "../user/entities/user-entity";
import ChanEntity from "./entities/chan-entity";

@Controller('chan')
// @UseGuards(AuthGuard('jwt'), UserAuthGuard)
export class ChanController {
    constructor(private readonly chanService: ChanService) {}

    @Get()
    getChans(): Promise<ChanEntity[]> { return this.chanService.findAll(); }

    @Get(':name')
    async findOne(@Param('name') name: string) {
        const chan: ChanEntity = await this.chanService.findOne(name);
        if (!chan) {
            throw new NotFoundException('Error while fetching chan by name: Cant find chan');
        }
        return chan;
    }

    @Post('create')
    createChan(@Body() createChanDto: CreateChanDto) {
        try {
            return this.chanService.createChan(createChanDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Post('createpriv')
    createPrivChan(@Body() createPrivChanDto: CreatePrivChanDto) {
      console.log("BLA", createPrivChanDto);
        try {
            return this.chanService.createPrivChan(createPrivChanDto);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get('/id/:id')
    async findOnebyID(@Param('id') id: string) {
        const chan: ChanEntity = await this.chanService.findOnebyID(id);
        if (!chan) {
            throw new NotFoundException('Error while fetching chan by id: Cant find chan');
        }
        return (chan);
    }

    @Get(':id/banned')
    getBanned(@Param('id') idroom: string): Promise<UserEntity[]> {
        try {
            return this.chanService.getBanned(idroom);
        } catch (error) {
            throw new Error(error);
        }
    }

    @Get(':idroom/isbanned/:iduser')
    async isBanned(@Param('idroom') idroom: string,
                   @Param('iduser') iduser: string
    ): Promise<boolean> {
        const chan = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking user status: Cant find chan');
        }
        for (let index = 0; index < chan.banUser.length; index++) {
            if (iduser === chan.banUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    @Get(':idroom/ismuted/:iduser')
    async isMuted(@Param('idroom') idroom: string,
                  @Param('iduser') iduser: string
    ): Promise<boolean> {
        const chan = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking user status: Cant find chan');
        }
        for (let index = 0; index < chan.muteUser.length; index++) {
            if (iduser === chan.muteUser[index].auth_id) {
                return true;
            }
        }
        return false;
    }

    @Get(':idroom/ispresent/:iduser')
    async isPresent(@Param('idroom') idroom: string,
                    @Param('iduser') iduser: string
    ): Promise<boolean> {
        const chan = await this.chanService.findOnebyID(idroom);
        if (!chan) {
            throw new NotFoundException('Error while checking if user is present in chan: Cant find chan');
        }
        for (let index = 0; index < chan.chanUser.length; index++) {
            if (iduser === chan.chanUser[index].auth_id) {
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
        try {
            return this.chanService.remove(username);
        } catch (error) {
            throw new Error(error);
        }
    }

	@Post('chanchat')
	tryChan(@Body() test: any) {
        try {
            return this.chanService.addMessage(test);
        } catch (error) {
            throw new Error(error);
        }
	}

}
