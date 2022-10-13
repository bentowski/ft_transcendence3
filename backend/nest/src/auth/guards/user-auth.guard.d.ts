import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth.service';
export declare class UserAuthGuard implements CanActivate {
    private authService;
    constructor(authService: AuthService);
    canActivate(context: ExecutionContext): boolean;
}
