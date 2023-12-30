import { Controller, Get, Param } from '@nestjs/common';
import { CareerService } from './service/career.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('career')
@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get('')
  findAll() {
    return this.careerService.findAll();
  }

  @Get('/:name')
  findOneByName(@Param('name') name: string) {
    return this.careerService.findOneByName(name);
  }
}
