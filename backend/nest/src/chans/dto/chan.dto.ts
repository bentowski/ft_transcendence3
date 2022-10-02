import { IsEmail, IsNotEmpty } from "class-validator";

/* data sent when requesting user informations */

export class ChanDto {

    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    topic: string;
}
