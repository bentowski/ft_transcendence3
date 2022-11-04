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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser42(user42: User42Dto): Promise<UserEntity> {
    //const { username } = user42;
    let user: UserEntity = undefined;
    //console.log('user42 = ', user42);
    user = await this.findOneByAuthId(user42.auth_id);
    if (!user) {
      //console.log('checking if username exists');
      let x = 0;
      while (await this.findOnebyUsername(user42.username)) {
        user42.username = user42.username + x.toString();
        //console.log('x = ', x);
        x++;
      }
      user = await this.createUser42(user42);
    }
    return user;
  }

  async currentUser(auth_id: string): Promise<UserEntity> {
    //let foundUser: UserEntity = undefined;
    const foundUser: UserEntity = await this.findOneByAuthId(auth_id);
    if (!foundUser) throw new NotFoundException('cant find user');
    return foundUser;
  }

  async createUser42(user42: User42Dto): Promise<UserEntity> {
    const user: UserEntity = this.userRepository.create(user42);
    user.friends = [];
    return this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    let user: UserEntity = undefined;
    /*
    user = await this.findOnebyUsername(username);
    if (user) {
      return;
    }
    */
    user = this.userRepository.create(createUserDto);
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
    let users: UserEntity[] = undefined;
    users = await this.userRepository.find();
    return users;
  }

  async findOnebyUsername(username?: string): Promise<UserEntity> {
    let findUsername: UserEntity = undefined;
    findUsername = await this.userRepository.findOne({
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
    let user: UserEntity = undefined;
    user = await this.findOneByAuthId(authId);
    const { username, avatar, twoFASecret, isTwoFA } = updateUserDto;
    //console.log(user);
    //console.log('isTwoFA = ', isTwoFA);
    //console.log('before editing = ' + user.isTwoFA);
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (twoFASecret) user.twoFASecret = twoFASecret;
    if (isTwoFA != user.isTwoFA) user.isTwoFA = isTwoFA;
    //console.log('after edit = ' + user.isTwoFA);
    //check if username is unique, ne pas renvoyer d'exceptions dans ce cas //
    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('error while modifying user');
    }
    return user;
  }

  async updateFriends(
    authId: string,
    updateFriendsDto: UpdateFriendsDto,
  ): Promise<UserEntity> {
    let user: UserEntity = undefined;
    user = await this.findOneByAuthId(authId);
    const { username, friends } = updateFriendsDto;
    if (username) user.username = username;
    if (friends) user.friends = friends;
    //check if username is unique, ne pas renvoyer d'exceptions dans ce cas //
    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('error while modifying user');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOneByAuthId(auth_id: string): Promise<UserEntity> {
    let findAuthId: UserEntity = undefined;
    findAuthId = await this.userRepository.findOneBy({ auth_id });
    return findAuthId;
  }

  async findOnebyID(user_id?: string): Promise<UserEntity> {
    let findId: UserEntity = undefined;
    findId = await this.userRepository.findOneBy({ user_id });
    return findId;
  }

  async setTwoFASecret(secret: string, user: UserEntity) {
    //console.log('setting twofasecret = ' + secret);
    return this.updateUser(user.auth_id, {
      username: user.username,
      avatar: user.avatar,
      twoFASecret: secret,
      isTwoFA: user.isTwoFA,
    });
  }

  async turnOnTwoFA(auth_id: string, user: UserEntity) {
    //console.log('turn on two fa user service');
    return this.updateUser(auth_id, {
      username: user.username,
      avatar: user.avatar,
      twoFASecret: user.twoFASecret,
      isTwoFA: 1,
    });
  }

  async turnOffTwoFA(auth_id: string, user: UserEntity) {
    console.log('turn off two fa user service');
    return this.updateUser(auth_id, {
      username: user.username,
      avatar: user.avatar,
      twoFASecret: user.twoFASecret,
      isTwoFA: 0,
    });
  }

  async setStatus(auth_id: string, status: number) {
    let user: UserEntity = undefined;
    user = await this.findOneByAuthId(auth_id);
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
