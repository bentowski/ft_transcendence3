import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException, ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {UserService} from "../../user/user.service";
import UserEntity from "../../user/entities/user-entity";
import jwt_decode from "jwt-decode";
import {PayloadInterface} from "../interfaces/payload.interface";
//import {InjectRepository} from "@nestjs/typeorm";
//import {UserService} from "../../user/user.service";
//import { Reflector } from '@nestjs/core';
//import UserEntity from '../../user/entities/user-entity';
//import { AuthService } from '../auth.service';
//import { JwtService } from '@nestjs/jwt';
//import { Observable } from 'rxjs';
//import { UserService } from '../user.service';
//import { Observable } from 'rxjs';

/*
@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
      @Inject(UserService)
      private userService: UserService
  ) {}


  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user: UserEntity = req.user;

    const decoded: PayloadInterface = jwt_decode(req.cookies['jwt']);
    if (decoded.isAuth === 0 && user.isTwoFA === 1) {
      throw new ForbiddenException('need 2fa');
    }
    return true;
  }
}
*/

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
}
