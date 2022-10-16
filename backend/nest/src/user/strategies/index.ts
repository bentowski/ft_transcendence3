/*
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import UserEntity from '../entities/user-entity';
import { JwtPayloadInterface } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      secretOrKey: process.env.SESSION_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const access_token = request?.cookies['jwt'];
          return access_token;
        },
      ]),
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const { username } = payload;
    const user: UserEntity = await this.userService.findOnebyUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
*/
