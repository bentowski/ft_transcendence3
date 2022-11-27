import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrivChanDto {
    @IsString()
    @IsNotEmpty()
    public type: string;

    @IsString()
    @IsNotEmpty()
    public name: string;

    // @IsString()
    // @IsNotEmpty()
    public user_1_id: string;

    // @IsString()
    // @IsNotEmpty()
    public user_2_id: string;
}
