import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user-entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    createUser(createUserDto: CreateUserDto): Promise<User> {
        const user: User = new User();

        user.username = createUserDto.username;
        user.id = createUserDto.id;
        user.email = createUserDto.email;
        user.password = createUserDto.password;

        return this.userRepository.save(createUserDto);
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(username: string): Promise<User> {
        return this.userRepository.findOneBy({ username });
    }

    async remove(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}
