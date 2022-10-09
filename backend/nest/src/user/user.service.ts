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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser42(user42: User42Dto): Promise<UserEntity> {
    const { auth_id } = user42;
    let user = await this.findOneByAuthId(auth_id);
    if (!user) {
      user = await this.createUser42(user42);
    } else {
      console.log('user already exists');
    }
    return user;
  }

  async createUser42(user42: User42Dto): Promise<UserEntity> {
    console.log('creating new user...');
    //console.log(user42);
    const user: UserEntity = this.userRepository.create(user42);
    user.friends = [];
    //user.username = user42.username;
    return this.userRepository.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    const user: UserEntity = this.userRepository.create(createUserDto);
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

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOnebyUsername(username?: string): Promise<UserEntity> {
    const findUsername = await this.userRepository.findOneBy({ username });
    return findUsername;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.findOnebyID(userId);
    console.log(user);
    const { username, avatar } = updateUserDto;

    //const updatedUser = { username, avatar };
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

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

  async findOneByAuthId(auth_id?: string): Promise<UserEntity> {
    const findAuthId = await this.userRepository.findOneBy({ auth_id });
    return findAuthId;
  }

  async findOnebyID(user_id?: string): Promise<UserEntity> {
    const findId = await this.userRepository.findOneBy({ user_id });
    return findId;
  }
}
