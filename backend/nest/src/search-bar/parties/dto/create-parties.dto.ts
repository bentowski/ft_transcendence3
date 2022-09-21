import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePartiesDto {

    public id: number;

    @IsString()
    @IsNotEmpty()
    public login: string;
}