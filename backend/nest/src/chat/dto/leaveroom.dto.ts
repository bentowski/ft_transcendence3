import {IsNotEmpty, IsString} from "class-validator";

export class LeaveRoomReceiveDto {
    @IsNotEmpty()
    @IsString()
    room: string;

    @IsNotEmpty()
    @IsString()
    auth_id: string;
}

export class LeaveRoomSendDto {

}