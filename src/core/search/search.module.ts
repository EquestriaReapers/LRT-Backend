import { Module } from '@nestjs/common';
import { SearchService } from './service/search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../users/users.module';
import { envData } from 'src/config/datasource';
import { OpensearchModule } from 'nestjs-opensearch';
import { IndexService } from './service/create-index.service';

@Module({
  imports: [
    UsersModule,
    OpensearchModule.forRoot({
      node: envData.ELASTIC_URL,
      auth: {
        username: envData.ELASTIC_USER,
        password: envData.ELASTIC_PASSWORD,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService, IndexService],
})
export class SearchModule {}
