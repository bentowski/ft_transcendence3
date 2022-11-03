import { IsNotEmpty, IsString } from 'class-validator';
import UserEntity from '../entities/user-entity';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  avatar: string;

  twoFASecret: string;

  isTwoFA: number;
}

export class UpdateUsernameDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class UpdateAvatarDto {
  @IsNotEmpty()
  avatar: string;
}

export class UpdateFriendsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  friends: Array<UserEntity>;
}

export class UpdateUserScoreDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  status: string;
}
