import { Module } from '@nestjs/common';
import { SearchBarController } from './search-bar.controller';
import { SearchBarService } from './search-bar.service';
import { PartiesModule } from './parties/parties.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [PartiesModule, ChannelsModule],
  controllers: [SearchBarController],
  providers: [SearchBarService]
})
export class SearchBarModule {}
