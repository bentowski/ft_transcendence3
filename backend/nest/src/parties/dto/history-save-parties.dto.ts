import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class HistorySavePartiesDto {
  public user_one_id: string;

  public user_two_id: string;

  @IsNumber()
  public score_one: number;

  @IsNumber()
  public score_two: number;

}
