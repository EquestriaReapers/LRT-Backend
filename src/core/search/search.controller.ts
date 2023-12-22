import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchProfileDto } from './dto/search.profiles.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiTags('search')
  @Get('/')
  public async getSearch() {
    const resp = await this.searchService.indexProfiles();
    console.log(resp);
  }

  @ApiTags('search')
  @Post('/')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'random', required: false })
  public async search(
    @Body() body: SearchProfileDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('random') random: number,
  ) {
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    const resp = await this.searchService.search(body, page, limit, random);
    return resp;
  }

  @ApiTags('search')
  @Delete('/')
  public async deleteIndex() {
    const resp = await this.searchService.deleteIndex();
    console.log(resp);
  }
}
