import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSourceConfig } from './config/datasource';
import { UsersController } from './core/users/users.controller';
import { UsersModule } from './core/users/users.module';
import { ProfilesModule } from './core/profiles/profiles.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { AuthModule } from './core/auth/auth.module';
import { ExperienceModule } from './core/experience/experience.module';
import { SkillsModule } from './core/skills/skills.module';
import { LanguageModule } from './core/language/language.module';
import { CareerModule } from './core/career/career.module';
import { SearchModule } from './core/search/search.module';
import { PortfolioModule } from './core/portfolio/portfolio.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/', //last slash was important
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `${process.env.NODE_ENV}.env`],
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    ProfilesModule,
    AuthModule,
    ExperienceModule,
    SkillsModule,
    LanguageModule,
    CareerModule,
    SearchModule,
    PortfolioModule,
  ],
  controllers: [AppController, UsersController],
  providers: [],
})
export class AppModule {}
