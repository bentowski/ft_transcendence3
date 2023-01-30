import { Strategy, Profile } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import {
  /* Inject, UnauthorizedException, */ Injectable,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import UserEntity from '../../user/entities/user-entity';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.API_CLIENT_ID,
      clientSecret: process.env.API_CLIENT_SECRET,
      // callbackURL: "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0f99e3f59a2cbe39bcefabcb0b19a8ff2a0c157f3f7ec959018365c016c303b6&redirect_uri=http%3A%2F%2Fbentowski.fr&response_type=code",
      // process.env.API_CALLBACK_URL,
      // https://api.intra.42.fr/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2F217.160.41.142%3A3000%2Fauth%2Fredirect&scope=public&client_id=u-s4t2ud-0f99e3f59a2cbe39bcefabcb0b19a8ff2a0c157f3f7ec959018365c016c303b6
      // https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-0f99e3f59a2cbe39bcefabcb0b19a8ff2a0c157f3f7ec959018365c016c303b6&redirect_uri=http%3A%2F%2Fbentowski.fr&response_type=code
      scope: ['public'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, username } = profile;
    const user = {
      auth_id: id,
      username: username,
      email: profile['emails'][0]['value'],
    };
    //console.log('lets go in this funciton');
    const newUser: UserEntity = await this.authService.validateUser(user);
    //console.log('welcome buddy');
    return newUser;
  }
}
