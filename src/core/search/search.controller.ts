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
    const profiles = await this.searchService.getProfiles();

    const resp = await this.searchService.addDocuments(profiles);
    console.log(resp);
  }

  @ApiTags('search')
  @Post('/')
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  public async searchProfile(
    @Body() search: SearchProfileDto,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    offset = Number(offset) || 0;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    return await this.searchService.search(search.text, {
      offset: offset,
      limit: limit,
      page: page,
    });
  }

  @Auth(UserRole.ADMIN)
  @ApiTags('admin-search')
  @Delete('/')
  public async deleteAllDocuments() {
    return await this.searchService.deleteAllDocuments();
  }
}
