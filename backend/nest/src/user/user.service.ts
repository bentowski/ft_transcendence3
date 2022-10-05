import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import UserEntity from './entities/user-entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { auth_id, username, email } = createUserDto;
    const user: UserEntity = this.userRepository.create(createUserDto);
    try {
      await this.userRepository.save(user);
    } catch (err) {
      console.log(err);
      throw new HttpException('cant create user', HttpStatus.BAD_REQUEST);
    }
    user.auth_id = auth_id;
    user.username = username;
    user.email = email;
    user.createdAt = new Date();
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOnebyUsername(username?: string): Promise<UserEntity> {
    const findUsername = await this.userRepository.findOneBy({ username });
    return findUsername;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOnebyID(user_id?: string): Promise<UserEntity> {
    const findId = await this.userRepository.findOneBy({ user_id });
    return findId;
  }
}
