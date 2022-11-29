import { IsString } from "class-validator";
import ChanEntity from "../entities/chan-entity";

export class ChanPasswordDto {
  @IsString()
  pass: string;
}

export class ChanMuteBanDto {
  chan: ChanEntity;
  auth_id: string;
  status: boolean;
}