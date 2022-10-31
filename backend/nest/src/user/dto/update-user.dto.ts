import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  avatar: string;

  twoFASecret: string;

  isTwoFA: number;
}

export class UpdateUserScoreDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  status: string;
}
