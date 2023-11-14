import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceConfig } from './config/datasource'
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { AuthModule } from './auth/auth.module';
import { ExperienciaModule } from './experiencia/experiencia.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/' //last slash was important
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `${process.env.NODE_ENV}.env`],
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    ProfilesModule,
    AuthModule,
    ExperienciaModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule { }
