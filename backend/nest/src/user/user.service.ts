import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import UserEntity from './entities/user-entity';
import { User42Dto } from './dto/user42.dto';
import {
  UpdateUserDto,
  UpdateAvatarDto,
  UpdateFriendsDto,
} from './dto/update-user.dto';
import { UpdateUsernameDto } from './dto/update-user.dto';
import {of} from "rxjs";
import {join} from "path";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser42(user42: User42Dto): Promise<UserEntity> {
    let user = await this.findOneByAuthId(user42.auth_id);
    if (!user) {
      let x = 0;
      while (await this.findOnebyUsername(user42.username)) {
        user42.username = user42.username + x.toString();
        x++;
      }
      try {
        user = await this.createUser42(user42);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    }
    return user;
  }

  async currentUser(auth_id: string): Promise<UserEntity> {
    const foundUser: UserEntity = await this.findOneByAuthId(auth_id);
    if (!foundUser) {
      throw new NotFoundException('cant find user');
    }
    return foundUser;
  }

  async createUser42(user42: User42Dto): Promise<UserEntity> {
    const user: UserEntity = this.userRepository.create(user42);
    user.friends = [];
    try {
      return this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    const user: UserEntity = this.userRepository.create(createUserDto);
    user.auth_id = auth_id;
    user.username = username;
    user.email = email;
    user.createdAt = new Date();
    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException('cant create user', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.userRepository.find();
    return users;
  }

  async findOnebyUsername(username?: string): Promise<UserEntity> {
    const findUsername: UserEntity = await this.userRepository.findOne({
      where: { username: username },
      relations: { friends: true, channelJoined: true },
    });
    return findUsername;
  }

  async updateUsername(auth_id: string, updateUsernameDto: UpdateUsernameDto) {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const findUser: UserEntity = await this.findOnebyUsername(
      updateUsernameDto.username,
    );
    if (findUser) {
      throw new HttpException('name already taken', HttpStatus.BAD_REQUEST);
    } else {
      user.username = updateUsernameDto.username;
      try {
        await this.userRepository.save(user);
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  async updateAvatar(auth_id: string, updateAvatarDto: UpdateAvatarDto) {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    user.avatar = updateAvatarDto.avatar;
    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateUser(
    authId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(authId);
    if (!user) {
      throw new HttpException('cant find user', HttpStatus.NOT_FOUND);
    }
    const { username, avatar, twoFASecret, isTwoFA } = updateUserDto;
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (twoFASecret) user.twoFASecret = twoFASecret;
    if (isTwoFA != user.isTwoFA) user.isTwoFA = isTwoFA;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      throw new InternalServerErrorException('error while modifying user');
    }
  }

  async updateFriends(
    authId: string,
    updateFriendsDto: UpdateFriendsDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOneByAuthId(authId);
    if (!user) {
      throw new HttpException('cant find user', HttpStatus.NOT_FOUND);
    }
    const { username, friends } = updateFriendsDto;
    if (username) user.username = username;
    if (friends) user.friends = friends;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (err) {
      throw new InternalServerErrorException('error while modifying user');
    }
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOneByAuthId(auth_id: string): Promise<UserEntity> {
    const findAuthId: UserEntity = await this.userRepository.findOneBy({
      auth_id,
    });
    return findAuthId;
  }

  async findOnebyID(user_id?: string): Promise<UserEntity> {
    const findId: UserEntity = await this.userRepository.findOneBy({ user_id });
    return findId;
  }

  async setTwoFASecret(secret: string, user: UserEntity) {
    return this.updateUser(user.auth_id, {
      username: user.username,
      avatar: user.avatar,
      twoFASecret: secret,
      isTwoFA: user.isTwoFA,
    });
  }

  async turnOnTwoFA(auth_id: string, user: UserEntity) {
    return this.updateUser(auth_id, {
      username: user.username,
      avatar: user.avatar,
      twoFASecret: user.twoFASecret,
      isTwoFA: 1,
    });
  }

  async turnOffTwoFA(auth_id: string, user: UserEntity) {
    return this.updateUser(auth_id, {
      username: user.username,
      avatar: user.avatar,
      twoFASecret: '',
      isTwoFA: 0,
    });
  }

  async getAvatar(id: string) {
    const user: UserEntity = await this.findOneByAuthId(id);
    if (!user.avatar) {
      user.avatar = 'default.jpg';
    }
    const imagename: any = user.avatar;
    return imagename;
  }

  async setStatus(auth_id: string, status: number) {
    const user: UserEntity = await this.findOneByAuthId(auth_id);
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }
    if (status == 1 || status == 0) {
      user.status = status;
      try {
        await this.userRepository.save(user);
      } catch (error) {
        throw new HttpException(
          'problem editing status user',
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      throw new HttpException('unknown status', HttpStatus.BAD_REQUEST);
    }
  }
}
