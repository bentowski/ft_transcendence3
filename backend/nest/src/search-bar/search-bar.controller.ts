import { Controller, Get } from '@nestjs/common';
import { SearchBarService } from './search-bar.service';

@Controller('search-bar')
export class SearchBarController {
    constructor(private readonly searchBarService: SearchBarService) {}

    @Get()
    getHello(): string {
      return this.searchBarService.getHello();
    }
}
