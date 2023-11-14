import { Module } from '@nestjs/common';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'src/profiles/entities/profile.entity';
import { JwtPayloadService } from 'src/common/service/jwt.payload.service';

const configService = new ConfigService();

@Module({
  imports: [
    DbValidatorsModule.register({
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port : configService.get('PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
    }),
    TypeOrmModule.forFeature([User, Profile])
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtPayloadService],
  exports: [TypeOrmModule, UsersService]
})
export class UsersModule {}
