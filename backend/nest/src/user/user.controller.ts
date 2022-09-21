import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getUsers() { return this.userService.findAll(); }

    @Get(':id')
    findOne(@Param('id') username: string) {
        return this.userService.findOne(username);
    }

    @Post('create')
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Delete()
    remove(@Param('id') username: string) {
        return this.userService.remove(username);
    }
}
