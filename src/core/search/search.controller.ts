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
import { SearchService } from './service/search.service';
import { SearchProfileDto } from './dto/search.profiles.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Career } from '../career/enum/career.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiTags('search')
  @Post('/')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'random', required: false })
  @ApiQuery({ name: 'searchExclude', required: false })
  public async search(
    @Body() body: SearchProfileDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('random') random: number,
    @Query('isExclusiveSkills') isExclusiveSkills: boolean,
    @Query('isExclusiveLanguages') isExclusiveLanguages: boolean,
  ) {
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    if (page === 0) page = 1;

    const resp = await this.searchService.search(
      body,
      page,
      limit,
      random,
      isExclusiveSkills,
    );
    return resp;
  }

  @ApiTags('search')
  @Post('/portfolio')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'random', required: false })
  public async searchPortfolio(
    @Body() body: SearchProfileDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('random') random: number,
  ) {
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    if (page === 0) page = 1;

    const resp = await this.searchService.searchPortfolio(
      body,
      page,
      limit,
      random,
    );
    return resp;
  }

  @ApiTags('search')
  @Get('/portfolio')
  public async getSearchPortfolio() {
    const resp = await this.searchService.indexPortfolio();
    console.log(resp);
  }

  @ApiTags('search')
  @Auth(UserRole.ADMIN)
  @Get('/')
  public async getSearch() {
    const resp = await this.searchService.indexProfiles();
    console.log(resp);
  }

  @ApiTags('search')
  @Auth(UserRole.ADMIN)
  @Delete('/')
  public async deleteIndex() {
    const resp = await this.searchService.deleteIndex();
    console.log(resp);
  }

  @ApiTags('search')
  @Auth(UserRole.ADMIN)
  @Delete('/portfolio')
  public async deleteIndexPortfolio() {
    const resp = await this.searchService.deleteIndexPortfolio();
    console.log(resp);
  }
}
