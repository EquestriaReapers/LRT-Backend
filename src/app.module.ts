import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'user',
      password: 'root',
      database: 'db_ucab_linkedin',
      autoLoadEntities : true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env.development' || '.env.production' || '.env.development.local',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
