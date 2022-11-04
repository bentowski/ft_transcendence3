import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpException,
  HttpStatus,
  NotFoundException,
  /*Request,
  UsePipes,
  ValidationPipe,
  Response,
  */
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateUserDto,
  UpdateFriendsDto,
  UpdateAvatarDto,
} from './dto/update-user.dto';
import { PayloadInterface } from '../auth/interfaces/payload.interface';
import UserEntity from './entities/user-entity';
import jwt_decode from 'jwt-decode';
import { Express } from 'express';
import path, { join } from 'path';
import JwtService from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IntraAuthGuard } from '../auth/guards/intra-auth.guard';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
//import { UserAuthGuard } from '../auth/guards/user-auth.guard';
//import { fileURLToPath } from 'url';
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

  //@UseGuards(UserAuthGuard)
  @Get()
  getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(UserAuthGuard)
  @Get('current')
  async currentUser(@Req() req: Request): Promise<UserEntity> {
    //console.log('request = ' + req);
    const token = req.cookies['jwt'];
    try {
      const decoded: PayloadInterface = jwt_decode(token);
      return this.userService.currentUser(decoded.auth_id);
    } catch (error) {
      throw new HttpException('error decoding token', HttpStatus.BAD_REQUEST);
    }
  }

  /*
  @Get('isauth')
  isAuth(@Req() req: Request): boolean {
    const token = req.cookies['jwt'];
    console.log('token ', token);
    return !!token;
  }
  */

  @UseGuards(UserAuthGuard)
  @Get('/name/:username')
  findOnebyUsername(@Param('username') username: string) {
    return this.userService.findOnebyUsername(username);
  }

  @UseGuards(UserAuthGuard)
  @Get('/id/:id')
  findOnebyID(@Param('id') id: string) {
    return this.userService.findOneByAuthId(id);
  }

  //@UseGuards(UserAuthGuard)
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(UserAuthGuard)
  @Delete('logout')
  logout(@Res() res): any {
    res.clearCookie('jwt');
    return 'User logged out';
  }

  @UseGuards(UserAuthGuard)
  @Patch('addFriends/:id')
  updateFriends(
    @Param('id') userId: string,
    @Body() updateFriendsDto: UpdateFriendsDto,
  ) {
    console.log(updateFriendsDto);
    return this.userService.updateFriends(userId, updateFriendsDto);
  }

  //@UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Param('id') username: string) {
    return this.userService.remove(username);
  }

  @UseGuards(UserAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('picture', storage))
  async uploadFile(
    @Res({ passthrough: true }) res,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //console.log('salut les amis');
    //console.log(file);
    const token = req.cookies['jwt'];
    const decoded: PayloadInterface = jwt_decode(token);
    const user: UserEntity = await this.userService.findOneByAuthId(
      decoded.auth_id,
    );
    if (!user) throw new NotFoundException('user not found');
    //of({ imagePath: file.filename });
    const newNameAvatar: UpdateAvatarDto = {
      avatar: file.filename,
    };
    //console.log('newUrlAvatar ; ', newNameAvatar);
    await this.userService.updateAvatar(decoded.auth_id, newNameAvatar);
    res.status(200);
  }

  @UseGuards(UserAuthGuard)
  @Get(':id/avatar')
  async getAvatar(@Req() req, @Param('id') id: string, @Res() res) {
    //console.log('requesting image');
    //console.log('reqqqqq = ', req);
    const user: UserEntity = await this.userService.findOneByAuthId(id);
    if (!user.avatar) {
      throw new NotFoundException('avatar null');
    }
    console.log('[ass pass');
    const imagename: any = user.avatar;
    //console.log('===== ', join('/uploads/profileimages/' + imagename));
    return of(
      res.sendFile(join(process.cwd(), './uploads/profileimages/' + imagename)),
    );
  }

  @UseGuards(UserAuthGuard)
  @Patch('update/username')
  updateUsername(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    try {
      const token = req.cookies['jwt'];
      const decoded: PayloadInterface = jwt_decode(token);
      return this.userService.updateUsername(decoded.auth_id, updateUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(UserAuthGuard)
  @Patch('update/avatar')
  updateAvatar(@Req() req, @Body() updateAvatarDto: UpdateAvatarDto) {
    try {
      const token = req.cookies['jwt'];
      const decoded: PayloadInterface = jwt_decode(token);
      return this.userService.updateAvatar(decoded.auth_id, updateAvatarDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
