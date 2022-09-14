import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchBarService {
    getHello(): string {
        return 'Hello World!';
      }
}
