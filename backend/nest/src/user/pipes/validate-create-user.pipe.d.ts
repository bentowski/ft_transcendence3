import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class ValidateCreateUserPipe implements PipeTransform {
    transform(value: CreateUserDto, metadata: ArgumentMetadata): void;
}
