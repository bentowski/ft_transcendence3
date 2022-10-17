import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserEntity from '../../user/entities/user-entity';
import { AuthService } from '../auth.service';
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import {Observable} from "rxjs";
//import { UserService } from '../user.service';
//import { Observable } from 'rxjs';

/*
@Injectable()
export class UserAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
*/

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
}