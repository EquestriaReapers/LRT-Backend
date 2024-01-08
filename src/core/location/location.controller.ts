import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { LocationService } from './service/location.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { LocationResponse } from './dto/response.dto';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL Location',
    type: [LocationResponse],
  })
  @ApiInternalServerError()
  @ApiQuery({ name: 'name', required: false })
  findAll(@Query('name') name: string) {
    return this.locationService.findAll(name);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns one Location',
    type: LocationResponse,
  })
  @ApiInternalServerError()
  @ApiException(() => NotFoundException, {
    description: 'Location not found',
  })
  findOne(@Param('id') id: number) {
    return this.locationService.findOne(+id);
  }
}
