import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceConfig } from './config/datasource'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `${process.env.NODE_ENV}.env`],
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
