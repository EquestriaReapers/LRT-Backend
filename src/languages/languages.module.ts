import { Module } from '@nestjs/common';
import { LanguagesService } from './service/languages.service';
import { LanguagesController } from './languages.controller';
import { Language } from './entities/language.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesModule } from 'src/core/profiles/profiles.module';

@Module({
  imports: [TypeOrmModule.forFeature([Language]), ProfilesModule],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule { }
