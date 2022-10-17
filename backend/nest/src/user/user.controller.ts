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
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Response,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileURLToPath } from 'url';
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
import { IntraAuthGuard } from '../auth/guards/intra-auth.guard';
import {PayloadInterface} from "../auth/interfaces/payload.interface";

@Controller('user')
//@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @Get('current')
  currentUser(@Req() req: PayloadInterface): Promise<UserEntity> {
    console.log('request = ' + req);
    return this.userService.currentUser(req.auth_id);
  }

  @Get('/name/:username')
  findOnebyUsername(@Param('username') username: string) {
    return this.userService.findOnebyUsername(username);
  }

  @Get('/id/:id')
  findOnebyID(@Param('id') id: string) {
    return this.userService.findOneByAuthId(id);
  }

  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(IntraAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return {
      User: req.user,
      msg: 'User logged in',
    };
  }

  @Get('logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'user session has ended' };
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
