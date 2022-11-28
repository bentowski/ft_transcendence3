import { IsString } from "class-validator";

export class ChanPasswordDto {
  @IsString()
  pass: string;
}