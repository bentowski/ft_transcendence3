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
  BadRequestException,
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
  BlockedUserDto,
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
import fs from 'fs';
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
  async findOnebyUsername(
    //@Res({ passthrough: true }) res,
    @Param('username') username: string,
  ) {
    const user: UserEntity = await this.userService.findOnebyUsername(username);
    if (!user) {
      throw new BadRequestException(
        'Error while fetching database: User with that username doesnt exists',
      );
    }
    return user;
  }

  //@UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get('/id/:id')
  async findOnebyID(@Param('id') id: string) {
    //console.log('ID - ', id);
    const user: UserEntity = await this.userService.findOneByAuthId(id);
    if (!user) {
      throw new BadRequestException(
        'Error while fetching database: User with that id doesnt exists',
      );
    }
    //console.log('uuuuuuSER - ', user);
    return user;
  }

  //@UseGuards(UserAuthGuard)
  @Post('create')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('updatefriend')
  updateFriends(
    @Req() req,
    @Body() updateFriendsDto: UpdateFriendsDto,
  ): Promise<UserEntity> {
    try {
      return this.userService.updateFriends(
        updateFriendsDto.action,
        req.user.auth_id,
        updateFriendsDto.auth_id,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/getfriends')
  async getFriends(@Param('id') id: string): Promise<UserEntity[]> {
    try {
      return this.userService.getFriends(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/isfriend')
  async isFriend(@Req() req, @Param('id') id: string): Promise<boolean> {
    try {
      //console.log('auth_id = ', id);
      const users: UserEntity[] = await this.userService.getFriends(
        req.user.auth_id,
      );
      for (let index = 0; index < users.length; index++) {
        if (users[index].auth_id === id) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/isblocked')
  async isBlocked(@Req() req, @Param('id') id: string): Promise<boolean> {
    try {
      const users: UserEntity[] = await this.userService.getBlocked(
        req.user.auth_id,
      );
      for (let index = 0; index < users.length; index++) {
        if (users[index].auth_id === id) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/getblocked')
  async getBlocked(@Param('id') id: string): Promise<UserEntity[]> {
    try {
      return this.userService.getBlocked(id);
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Patch('updateblocked')
  async updateBlocked(@Req() req, @Body() usr: BlockedUserDto) {
    try {
      return this.userService.updateBlocked(
        usr.action,
        usr.auth_id,
        req.user.auth_id,
      );
    } catch (error) {
      throw new Error(error);
    }
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
    //console.log('saloute');
    const auid: string = req.user.auth_id;
    const user: UserEntity = await this.userService.findOneByAuthId(auid);
    if (!user) {
      throw new BadRequestException(
        'Error while uploading an image: Failed requesting user in database',
      );
    }
    const newNameAvatar: UpdateAvatarDto = {
      avatar: file.filename,
    };
    try {
      await this.userService.updateAvatar(auid, newNameAvatar);
      //res.status(200)
    } catch (error) {
      throw new Error(error);
    }
  }

  @UseGuards(AuthGuard('jwt'), UserAuthGuard)
  @Get(':id/avatar')
  async getAvatar(
    @Param('id') id: string,
    @Res() res,
  ): Promise<Observable<object>> {
    try {
      let imagename: string = await this.userService.getAvatar(id);
      imagename = this.userService.checkFolder(imagename);
      return of(
        res.sendFile(
          join(process.cwd(), './uploads/profileimages/' + imagename),
        ),
      );
    } catch (error) {
      throw new Error(error);
    }
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
