import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getUsers(): Promise<import("./entities/user-entity").User[]>;
    createUser(createUserDto: CreateUserDto): Promise<import("./entities/user-entity").User>;
    remove(username: string): Promise<void>;
}
