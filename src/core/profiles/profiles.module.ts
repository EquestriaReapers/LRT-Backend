import { Module } from '@nestjs/common';
import { ProfilesService } from './service/profiles.service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skills/entities/skill.entity';
import { ContactMethod } from './entities/contact-method.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Skill, ContactMethod])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule { }
