import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import UserEntity from './entities/user-entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto);
    user.auth_id = createUserDto.auth_id;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    return user;
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(username?: string): Promise<UserEntity> {
    const findUsername = await this.userRepository.findOneBy({ username });
    return findUsername;
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOnebyID(user_id?: bigint): Promise<UserEntity> {
    const findId = await this.userRepository.findOneBy({ user_id });
    return findId;
  }
}
