import { IsEmail, IsNotEmpty } from "class-validator";

/* data sent when requesting user informations */

export class UserDto {

    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
