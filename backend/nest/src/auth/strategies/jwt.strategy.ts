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
      secretOrKey: process.env.SECRET_KEY,
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
    const { auth_id } = payload;
    const newUser = await this.authService.findUser(auth_id);
    if (!newUser) {
      throw new UnauthorizedException('Invalid Token');
    }
    return newUser;
  }
}
