import { Module } from '@nestjs/common';
import ProfilesService from './service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skills/entities/skill.entity';
import FindAllPaginateAction from './service/find-all-paginate.action';
import { LanguageProfile } from './entities/language-profile.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Skill, LanguageProfile])],
  controllers: [ProfilesController],
  providers: [ProfilesService, FindAllPaginateAction],
  exports: [ProfilesService],
})
export class ProfilesModule {}
