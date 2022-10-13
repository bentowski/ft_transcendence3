import { Profile } from 'passport-42';
import { AuthService } from '../auth.service';
declare const IntraStrategy_base: new (...args: any[]) => any;
export declare class IntraStrategy extends IntraStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<import("../../user/entities/user-entity").UserEntity>;
}
export {};
