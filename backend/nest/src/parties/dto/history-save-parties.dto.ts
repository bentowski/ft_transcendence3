import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class HistorySavePartiesDto {
  @IsNotEmpty()
  @IsString()
  user_one: string;

  @IsNotEmpty()
  @IsString()
  user_two: string;

  @IsNumber()
  @IsNumber()
  score_one: number;

  @IsNotEmpty()
  @IsNumber()
  score_two: number;

  @IsNotEmpty()
  @IsString()
  winner: string;

  @IsNotEmpty()
  @IsString()
  looser: string;

}
