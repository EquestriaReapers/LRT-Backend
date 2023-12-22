import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MeiliSearchModule.forRoot({
      host: 'http://localhost:7700',
      apiKey: 'masterKey',
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
