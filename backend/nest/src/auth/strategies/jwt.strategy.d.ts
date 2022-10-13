import { AuthService } from '../auth.service';
import UserEntity from '../../user/entities/user-entity';
import { PayloadInterface } from '../interfaces/payload.interface';
import { Request } from 'express';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(req: Request, payload: PayloadInterface): Promise<UserEntity>;
}
export {};
