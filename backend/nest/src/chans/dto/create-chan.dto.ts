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

export class CreatePrivChanDto {
    @IsNotEmpty()
    type: "direct";

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    user_1_id: string;

    @IsNotEmpty()
    user_2_id: string;
}
