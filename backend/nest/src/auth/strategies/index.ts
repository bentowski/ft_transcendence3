import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import UserEntity from '../../user/entities/user-entity';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.API_CLIENT_ID,
      clientSecret: process.env.API_CLIENT_SECRET,
      callbackURL: process.env.API_CALLBACK_URL,
      scope: ['identify', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { username } = profile;
    const user = {
      username: username,
      email: profile['emails'][0]['value'],
    };
  }
}
