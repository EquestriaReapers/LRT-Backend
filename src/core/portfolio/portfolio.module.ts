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
import { validateImageFile } from 'src/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Profile])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(validateImageFile)
      .forRoutes(
        { path: 'portfolio', method: RequestMethod.POST },
        { path: 'portfolio/:id', method: RequestMethod.PATCH },
      );
  }
}
