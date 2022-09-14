import { Repository } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user-entity";
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    remove(id: string): Promise<void>;
}
