import { IsNotEmpty, IsString } from 'class-validator';
import UserEntity from "../entities/user-entity"
export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  avatar: string;

  twoFASecret: string;

  isTwoFA: number;
}

export class UpdateFriendsDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  friends: Array<UserEntity>;
}
