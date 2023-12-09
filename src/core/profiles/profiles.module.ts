import { Module } from '@nestjs/common';
import ProfilesService from './service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skills/entities/skill.entity';
import FindAllPaginateAction from './service/find-all-paginate.action';
import ExportPDFAction from './service/export-pdf';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Skill])],
  controllers: [ProfilesController],
  providers: [ProfilesService, FindAllPaginateAction, ExportPDFAction],
  exports: [ProfilesService],
})
export class ProfilesModule {}
