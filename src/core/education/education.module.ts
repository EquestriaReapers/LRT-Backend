import { Module } from '@nestjs/common';
import { EducationService } from './service/education.service';
import { EducationController } from './education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, Profile])],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
