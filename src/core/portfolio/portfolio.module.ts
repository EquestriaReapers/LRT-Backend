import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PortfolioService } from './service/portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { CleanBodyMiddleware } from 'src/common/utils/clean-body';
import { validateImageFile } from 'src/constants';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule, TypeOrmModule.forFeature([Portfolio, Profile])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CleanBodyMiddleware).forRoutes(PortfolioController);
    consumer
      .apply(validateImageFile)
      .forRoutes(
        { path: 'portfolio', method: RequestMethod.POST },
        { path: 'portfolio/:id', method: RequestMethod.PATCH },
      );
  }
}
