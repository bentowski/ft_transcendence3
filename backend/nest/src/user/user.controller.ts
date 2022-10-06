import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidateCreateUserPipe } from './pipes/validate-create-user.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get('/name/:username')
  findOnebyUsername(@Param('username') username: string) {
    return this.userService.findOnebyUsername(username);
  }

  @Get(':id')
  findOnebyID(@Param('id') id: string) {
    return this.userService.findOnebyID(id);
  }

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('settings/:id')
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete()
  remove(@Param('id') username: string) {
    return this.userService.remove(username);
  }
}
