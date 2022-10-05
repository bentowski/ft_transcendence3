import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/* create user dto will be received when a user will create a profile,
this will call the post request
 */

export class CreateChanDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: 'takes name'})
    public name: string;

    @IsEmail()
    @IsNotEmpty()
    public topic: string;

    @IsString()
    @IsNotEmpty()
    public password: string;

}
