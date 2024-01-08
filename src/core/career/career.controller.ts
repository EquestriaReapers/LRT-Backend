import { Controller, Get, Param, Query } from '@nestjs/common';
import { CareerService } from './service/career.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('career')
@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get('')
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('search') search: string) {
    return this.careerService.findAll(search);
  }

  @Get('/:id')
  findOneByName(@Param('id') id: number) {
    return this.careerService.findOneByid(id);
  }
}
