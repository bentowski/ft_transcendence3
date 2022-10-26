import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class HistorySavePartiesDto {
  public user_one: string;

  public user_two: string;

  @IsNumber()
  public score_one: number;

  @IsNumber()
  public score_two: number;

}
