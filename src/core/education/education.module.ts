import { Module } from '@nestjs/common';
import { EducationService } from './service/education.service';
import { EducationController } from './education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [SearchModule, TypeOrmModule.forFeature([Education, Profile])],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
