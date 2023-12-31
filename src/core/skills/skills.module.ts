import { Module } from '@nestjs/common';
import { SkillsService } from './service/skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from '../profiles/profiles.module';
import { Skill } from './entities/skill.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { SkillsProfile } from '../profiles/entities/skills-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, Profile, SkillsProfile]), ProfilesModule],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule { }
