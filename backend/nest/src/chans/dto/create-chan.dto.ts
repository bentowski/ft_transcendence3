import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChanDto {
    @IsString()
    @IsNotEmpty()
    public type: string;

    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public owner: string;

    @IsString()
    password: string;
}
