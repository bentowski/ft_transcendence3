import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import UserEntity from '../user/entities/user-entity';
import { User42Dto } from '../user/dto/user42.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('USER_SERVICE') private userService: UserService) {}

  async validateUser(user42: User42Dto): Promise<UserEntity> {
    return this.userService.validateUser42(user42);
  }

  createUser(user42: User42Dto): Promise<UserEntity> {
    return this.userService.createUser42(user42);
  }

  findUser(authId: string): Promise<UserEntity | undefined> {
    return this.userService.findOneByAuthId(authId);
  }
}
