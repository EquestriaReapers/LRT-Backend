import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { MeiliSearchModule } from 'nestjs-meilisearch';
import { UsersModule } from '../users/users.module';
import { envData } from 'src/config/datasource';

@Module({
  imports: [
    UsersModule,
    MeiliSearchModule.forRoot({
      host: envData.MEILISEARCH,
      apiKey: envData.MEILISEARCH_KEY,
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
