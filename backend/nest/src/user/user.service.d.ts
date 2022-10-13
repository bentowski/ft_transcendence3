import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import UserEntity from './entities/user-entity';
import { User42Dto } from './dto/user42.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    validateUser42(user42: User42Dto): Promise<UserEntity>;
    currentUser(user: UserEntity): Promise<UserEntity>;
    createUser42(user42: User42Dto): Promise<UserEntity>;
    createUser(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOnebyUsername(username?: string): Promise<UserEntity>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<void>;
    findOneByAuthId(auth_id: string): Promise<UserEntity>;
    findOnebyID(user_id?: string): Promise<UserEntity>;
}
