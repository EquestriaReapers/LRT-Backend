import { Module } from '@nestjs/common';
import { ExperienciaController } from './experiencia.controller';
import { ExperienciaService } from './service/experiencia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experiencia } from './entities/experiencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experiencia])],
  controllers: [ExperienciaController],
  providers: [ExperienciaService],
  exports: [ExperienciaService]
})
export class ExperienciaModule { }
