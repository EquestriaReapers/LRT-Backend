import { Module } from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { ExperienceController } from './experience.controller';
import { Experience } from './entities/experience.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Experience])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
  exports: [ExperienceService],
})
export class ExperienceModule {}
