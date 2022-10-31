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
import { UpdateUserDto } from './dto/update-user.dto';
import { PayloadInterface } from '../auth/interfaces/payload.interface';
import UserEntity from './entities/user-entity';
import jwt_decode from 'jwt-decode';
import JwtService from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { IntraAuthGuard } from '../auth/guards/intra-auth.guard';
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

  //@UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get()
  //@UseGuards(AuthGuard('jwt'))
  getUsers() {
    return this.userService.findAll();
  }

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

  /*
  @UseGuards(IntraAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return {
      User: req.user,
      msg: 'User logged in',
    };
  }
  */

  @Delete('logout')
  logout(@Res() res): any {
    res.clearCookie('jwt');
    return 'User logged out';
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
