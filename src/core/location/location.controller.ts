import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationService } from './service/location.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiQuery({ name: 'name', required: false })
  findAll(@Query('name') name: string) {
    return this.locationService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(+id);
  }
}
