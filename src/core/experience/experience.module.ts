import { Module } from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { ExperienceController } from './experience.controller';
import { Experience } from './entities/experience.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule, TypeOrmModule.forFeature([Experience])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
