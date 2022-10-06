import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidateCreateUserPipe } from './pipes/validate-create-user.pipe';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req:any, file:any, cb:any) => {
      let filename: string = file.originalname.replace(/\s/g, '');// + uuidv4();
      let lastDot = filename.lastIndexOf('.');
      filename = filename.substring(0, lastDot) + uuidv4() + filename.substring(lastDot);
      cb(null, `${filename}`)
    }
  })
}

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

  @Delete()
  remove(@Param('id') username: string) {
    return this.userService.remove(username);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file:any): Observable<Object> {
    console.log(file);
    return of({imagePath: file.filename});
  }
}
