import UserEntity from '../user/entities/user-entity';
import { UserDto } from '../user/dto/user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

/* theses functions will allow data mapping between frontend and
 * backend. will be called in service, map dto to entity */

export const toUserDto = (data: UserEntity): UserEntity => {
  const { user_id, username, email } = data;
  const newUser: CreateUserDto = { auth_id, username, email };
  return newUser;
};
