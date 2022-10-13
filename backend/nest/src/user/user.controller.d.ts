import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Observable } from 'rxjs';
import { UpdateUserDto } from './dto/update-user.dto';
import UserEntity from './entities/user-entity';
export declare const storage: {
    storage: any;
};
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    currentUser(req: any): Promise<UserEntity>;
    getUsers(): Promise<UserEntity[]>;
    findOnebyUsername(username: string): Promise<UserEntity>;
    findOnebyID(id: string): Promise<UserEntity>;
    createUser(createUserDto: CreateUserDto): Promise<UserEntity>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(username: string): Promise<void>;
    uploadFile(file: any): Observable<Object>;
}
