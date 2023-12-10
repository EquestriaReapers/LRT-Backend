import { Module } from '@nestjs/common';
import ProfilesService from './service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skills/entities/skill.entity';
import FindAllPaginateAction from './service/find-all-paginate.action';
import { LanguageProfile } from './entities/language-profile.entity';
import { Language } from '../language/entities/language.entity';
import { LanguageModule } from '../language/language.module';
import LanguagueProfileService from './service/languague-profile.service';

@Module({
  imports: [
    UsersModule,
    LanguageModule,
    TypeOrmModule.forFeature([Skill, LanguageProfile, Language]),
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService, FindAllPaginateAction, LanguagueProfileService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
