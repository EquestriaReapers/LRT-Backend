import { Module } from '@nestjs/common';
import ProfilesService from './service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skills/entities/skill.entity';
import FindAllPaginateAction from './service/find-all-paginate.action';
import { LanguageProfile } from './entities/language-profile.entity';
import ProfileTemplateAdaptator from './service/export-pdf/profile-template-adapter.class';
import { Language } from '../language/entities/language.entity';
import { LanguageModule } from '../language/language.module';
import ExportPDFAction from './service/export-pdf';
import LanguagueProfileService from './service/languague-profile.service';
import { SkillsProfile } from './entities/skills-profile.entity';
import { HttpModule } from '@nestjs/axios';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    UsersModule,
    LanguageModule,
    HttpModule,
    TypeOrmModule.forFeature([Skill, LanguageProfile, Language, SkillsProfile]),
    SearchModule,
  ],
  controllers: [ProfilesController],
  providers: [
    ProfilesService,
    FindAllPaginateAction,
    ExportPDFAction,
    LanguagueProfileService,
    ProfileTemplateAdaptator,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
