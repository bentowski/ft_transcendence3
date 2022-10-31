import { Injectable, UnauthorizedException } from '@nestjs/common';
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
      secretOrKey: `${process.env.JWT_SECRET_KEY}`,
      ignoreExpiration: false,
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
    console.log('validatin jwt strategy');
    const { auth_id } = payload;
    const newUser = await this.authService.findUser(auth_id);
    //console.log(newUser);
    if (!newUser) {
      throw new UnauthorizedException('Invalid Token');
    }
    if (!newUser.isTwoFA) {
      console.log('jwt strategy user dont need two fa');
      return newUser;
    }
    if (payload.isAuth) {
      console.log('jwt strategy user is log');
      return newUser;
    }
  }
}
