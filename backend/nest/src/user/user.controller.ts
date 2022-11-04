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
  NotFoundException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  /*Request,
  UsePipes,
  HttpException,
  HttpStatus,
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
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
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

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('current')
  async currentUser(@Req() req): Promise<UserEntity> {
    const auid: string = req.user.auth_id;
    try {
      return this.userService.currentUser(auid);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('/name/:username')
  findOnebyUsername(@Param('username') username: string) {
    return this.userService.findOnebyUsername(username);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('/id/:id')
  findOnebyID(@Param('id') id: string) {
    return this.userService.findOneByAuthId(id);
  }

  //@UseGuards(UserAuthGuard)
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('addFriends/:id')
  updateFriends(
    @Param('id') userId: string,
    @Body() updateFriendsDto: UpdateFriendsDto,
  ) {
    return this.userService.updateFriends(userId, updateFriendsDto);
  }

  //@UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Param('id') username: string) {
    return this.userService.remove(username);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('picture', storage))
  async uploadFile(
    @Res({ passthrough: true }) res,
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('saloute');
    const auid: string = req.user.auth_id;
    const user: UserEntity = await this.userService.findOneByAuthId(auid);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const newNameAvatar: UpdateAvatarDto = {
      avatar: file.filename,
    };
    await this.userService.updateAvatar(auid, newNameAvatar);
    res.status(200);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/avatar')
  async getAvatar(
    @Param('id') id: string,
    @Res() res,
  ): Promise<Observable<object>> {
    const imagename: string = await this.userService.getAvatar(id);
    const fs = require('fs');
    console.log('image name = ', imagename);
    const files = fs.readdirSync('./uploads/profileimages/');
    console.log('files = ', files);
    if (Object.values(files).indexOf(imagename) === -1) {
      console.log('no file in folder');
      return of(
        res.sendFile(
          join(process.cwd(), './uploads/profileimages/default.jpg'),
        ),
      );
    }
    return of(
      res.sendFile(join(process.cwd(), './uploads/profileimages/' + imagename)),
    );
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('update/username')
  updateUsername(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const auid: string = req.user.auth_id;
    try {
      return this.userService.updateUsername(auid, updateUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('update/avatar')
  updateAvatar(@Req() req, @Body() updateAvatarDto: UpdateAvatarDto) {
    const auid: string = req.user.auth_id;
    try {
      return this.userService.updateAvatar(auid, updateAvatarDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
