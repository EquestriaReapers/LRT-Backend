import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PortfolioService } from './service/portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { CleanBodyMiddleware } from 'src/common/utils/clean-body';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Profile])],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CleanBodyMiddleware).forRoutes(PortfolioController);
  }
}
