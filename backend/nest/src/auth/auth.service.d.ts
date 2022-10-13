import { UserService } from '../user/user.service';
import UserEntity from '../user/entities/user-entity';
import { User42Dto } from '../user/dto/user42.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    private userService;
    constructor(jwtService: JwtService, userService: UserService);
    validateUser(user42: User42Dto): Promise<UserEntity>;
    findUser(authId: string): Promise<UserEntity | undefined>;
}
