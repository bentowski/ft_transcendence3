import {IsAlphanumeric, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateChanDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    owner: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    @IsString()
    password: string;
}

export class CreatePrivChanDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @MinLength(2)
    @MaxLength(10)
    @IsAlphanumeric()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    user_1_id: string;

    @IsNotEmpty()
    @IsString()
    user_2_id: string;
}
