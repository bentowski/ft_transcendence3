import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import UserEntity from '../../user/entities/user-entity';
import { PayloadInterface } from '../interfaces/payload.interface';
import { Request } from 'express';
//import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      secretOrKey: process.env.SECRET_KEY,
      ignoreExpiration: false,
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //passReqToCallback: true,

      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let access_token = undefined;
          access_token = request?.cookies['jwt'];
          return access_token;
        },
      ]),

    });
  }

  async validate(payload: PayloadInterface): Promise<UserEntity> {
    const { auth_id } = payload;
    console.log('auth_id = ' + auth_id);
    //console.log(req.user);
    const newUser = await this.authService.findUser(auth_id);
    console.log(newUser);
    if (!newUser) {
      throw new UnauthorizedException('Invalid Token');
    }
    //implement here token validation for revoked users (logout, refresh)
    /*
    const infosUser = {
      auth_id: newUser.auth_id,
      username: newUser.username,
      //avatar: newUser.avatar,
    }
    */
    console.log('GOGOGO');
    return newUser;
  }
}
