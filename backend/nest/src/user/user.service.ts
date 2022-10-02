import {
    HttpException,
    HttpStatus,
    Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import UserEntity from "./entities/user-entity";
import { UserDto } from "./dto/user.dto";
import { toUserDto } from "../shared/mapper";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
        //const user: User = new User();
        const { username, password, email } = createUserDto;

        //checks if the user exists in db
        const userInDb = await this.userRepository.findOne({
            where: { username }
        });
        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        const user: UserEntity = await this.userRepository.create({
            username, password, email,
        })
        await this.userRepository.save(user);
        return toUserDto(user);
    }

    findAll(): Promise<UserEntity[]> {
        return this.userRepository.find();
    }

    async findOne(username?: string): Promise<UserDto> {
        const user = await this.userRepository.findOneBy({ username });
        return toUserDto(user);
    }

    async findOnebyID(id?: string): Promise<UserDto> {
        const user = await this.userRepository.findOneBy({ id });
        return toUserDto(user);
    }


    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
