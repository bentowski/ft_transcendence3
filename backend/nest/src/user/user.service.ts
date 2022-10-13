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
import { UpdateUserDto } from './dto/update-user.dto';
import { ProfileEntity } from './entities/profile-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser42(user42: User42Dto): Promise<UserEntity> {
    //const { username } = user42;
    let user: UserEntity = undefined;
    user = await this.findOnebyUsername(user42.username);
    console.log('vaildateuser42 username = ' + user42.username);
    /*
    if (user) {
      user.username = username;
    } else {
      user = await this.createUser42(user42);
    }
    */
    if (!user) user = await this.createUser42(user42);
    return user;
  }

  async currentUser(user: UserEntity): Promise<UserEntity> {
    //let foundUser: UserEntity = undefined;
    console.log('set test = ' + user.user_id);
    const foundUser: UserEntity = await this.findOnebyID(user.user_id);
    if (!user) throw new NotFoundException('cant find user');
    //const { ...response } = user;
    //console.log('get current user = ' + response);
    return foundUser;
  }

  async createUser42(user42: User42Dto): Promise<UserEntity> {
    console.log('creating new user42');
    const user: UserEntity = this.userRepository.create(user42);
    user.friends = [];
    user.username = user42.username;
    return this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    let user: UserEntity = undefined;
    user = this.userRepository.create(createUserDto);
    try {
      user.auth_id = auth_id;
      user.username = username;
      user.email = email;
      user.avatar =
        'https://avatars.dicebear.com/api/personas/' + auth_id + '.svg';
      user.createdAt = new Date();
      await this.userRepository.save(user);
    } catch (err) {
      console.log(err);
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
    findUsername = await this.userRepository.findOneBy({ username });
    //const usr: any = {
    //  username: findUsername.username,
    //};
    return findUsername;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    let user: UserEntity = undefined;
    user = await this.findOneByAuthId(userId);
    console.log(user);
    const { username, avatar } = updateUserDto;

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

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
}
