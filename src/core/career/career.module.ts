import { Module } from '@nestjs/common';
import { CareerService } from './service/career.service';
import { CareerController } from './career.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [CareerController],
  providers: [CareerService],
  exports: [CareerService],
})
export class CareerModule {}
