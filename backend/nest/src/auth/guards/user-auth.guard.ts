import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import UserEntity from '../../user/entities/user-entity';
import { PayloadInterface } from '../interfaces/payload.interface';
import jwt_decode from 'jwt-decode';
import { AuthService } from '../auth.service';
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
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
*/

/*
@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {}
*/

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const cookie = req.cookies['jwt'];
    if (!cookie) {
      //console.log('no cookie for the pookie 0');
      return false;
    } else {
      //console.log('welcome to the club mate');
      const token: PayloadInterface = jwt_decode(cookie);
      //console.log('getting token = ', token);
      if (!req.user) {
        //console.log('cant find user 1');
        return false;
      } else {
        if (req.user.isTwoFA) {
          //console.log('token said u need 2fa');
          if (!token.isAuth) {
            //console.log('no 2');
            return false;
          } else {
            //console.log('yes 3');
            return true;
          }
          //console.log('need 2fa please dont cheat');
        } else {
          //console.log('token said you can come in 4');
          return false;
        }
      }
    }
  }
}
