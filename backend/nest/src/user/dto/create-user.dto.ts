import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/* create user dto will be received when a user will create a profile,
this will call the post request
 */

export class CreateUserDto {

    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({ description: 'takes username'})
    public username: string;

    // @IsEmail()
    // @IsNotEmpty()
    public email: string;
    //
    // @IsString()
    // @IsNotEmpty()
    public password: string;

}
