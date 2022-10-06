import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.API_CLIENT_ID,
      clientSecret: process.env.API_CLIENT_SECRET,
      callbackURL: process.env.API_CALLBACK_URL,
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, username } = profile;
    console.log(id);
    console.log(username);
    const user = {
      auth_id: id,
      username: username,
      email: profile['emails'][0]['value'],
    };
    const newUser = await this.authService.validateUser(user);
    if (!newUser) {
      throw new UnauthorizedException();
    }
    return newUser;
  }
}
