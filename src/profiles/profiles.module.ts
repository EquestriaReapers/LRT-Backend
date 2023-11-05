import { Module } from '@nestjs/common';
import { ProfilesService } from './service/profiles.service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports : [
    UsersModule
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService]
})
export class ProfilesModule {}
