import { Module } from '@nestjs/common';
import { SearchService } from './service/search.service';
import { SearchController } from './search.controller';
import { UsersModule } from '../users/users.module';
import { envData } from 'src/config/datasource';
import { OpensearchModule } from 'nestjs-opensearch';
import { IndexService } from './service/create-index.service';
import { Portfolio } from '../portfolio/entities/portfolio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Language } from '../language/entities/language.entity';
import { UserProfileCacheUpdater } from './service/user-profile-cache-updater.class';
import { UserProfilePresenter } from './service/user-profile-presenter.class';

@Module({
  imports: [
    UsersModule,
    HttpModule,
    TypeOrmModule.forFeature([Portfolio, Language]),
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
  providers: [
    SearchService,
    IndexService,
    UserProfileCacheUpdater,
    UserProfilePresenter,
  ],
  exports: [SearchService, IndexService, UserProfileCacheUpdater],
})
export class SearchModule {}
