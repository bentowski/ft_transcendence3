import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import UserEntity from './entities/user-entity';
//import { ValidateCreateUserPipe } from './pipes/validate-create-user.pipe';
//import { fileURLToPath } from 'url';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req: any, file: any, cb: any) => {
      let filename: string = file.originalname.replace(/\s/g, ''); // + uuidv4();
      const lastDot = filename.lastIndexOf('.');
      filename =
        filename.substring(0, lastDot) + uuidv4() + filename.substring(lastDot);
      cb(null, `${filename}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  currentUser(@Req() req): Promise<UserEntity> {
    const user: UserEntity = req.user;
    console.log('request = ' + req.user);
    return this.userService.currentUser(user);
  }

  //@UseGuards(AuthGuard('jwt'), UserAuthGuard)
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
    return this.userService.findOneByAuthId(id);
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
    // console.log(updateUserDto);
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') username: string) {
    return this.userService.remove(username);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file: any): Observable<Object> {
    console.log(file);
    return of({ imagePath: file.filename });
  }
}
