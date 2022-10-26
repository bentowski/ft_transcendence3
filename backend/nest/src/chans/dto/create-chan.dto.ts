import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    public topic: string;

    @IsNotEmpty()
    public admin: Array<string>;

    @IsString()
    @IsNotEmpty()
    password: string;

}
