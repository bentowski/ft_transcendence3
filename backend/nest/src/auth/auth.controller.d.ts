/// <reference types="passport" />
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private jwtService;
    constructor(jwtService: JwtService);
    login(): void;
    redirect(res: Response, req: Request): Promise<any>;
    status(req: Request): Express.User;
    logout(): void;
}
