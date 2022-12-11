import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreatePartiesDto {

    public id: number;

    @IsString()
    @IsNotEmpty()
    public login: string;

    @IsNumber()
    @IsNotEmpty()
    public nbplayer: number;
}
