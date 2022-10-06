import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import UserEntity from '../../user/entities/user-entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error, user: UserEntity) => void) {
    done(null, user);
  }

  deserializeUser(
    user: UserEntity,
    done: (err: Error, user: UserEntity) => void,
  ) {}
}
