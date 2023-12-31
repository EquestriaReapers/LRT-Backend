import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { envData } from '../../config/datasource';
import { EmailVerificationEntity } from './entities/emailverification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtPayloadService } from '../../common/service/jwt.payload.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: envData.JWTSECRET,
      signOptions: { expiresIn: '31d' },
    }),
    TypeOrmModule.forFeature([EmailVerificationEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtPayloadService],
  exports: [AuthService],
})
export class AuthModule {}
