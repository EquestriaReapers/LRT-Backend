import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PortafolioController } from './portafolio.controller';
import { Portafolio } from './entities/portafolio.entity';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import { PortafolioService } from './service/portafolio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Portafolio, Profile])],
  controllers: [PortafolioController],
  providers: [PortafolioService],
})
export class PortafolioModule { }
