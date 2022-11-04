import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from "../../user/entities/user-entity";

/* create user dto will be received when a user will create a profile,
this will call the post request
 */

export class CreateChanDto {

    @IsString()
    @IsNotEmpty()
    public type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'takes name'})
    public name: string;

    @IsEmail()
    @IsNotEmpty()
    public owner: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    public chanUser: Array<UserEntity>;

}
