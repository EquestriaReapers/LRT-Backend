import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { LanguageService } from './service/language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Language } from './entities/language.entity';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { MessageDTO } from 'src/common/dto/response.dto';
import { UserRole } from 'src/constants';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @ApiTags('admin-language')
  @Post()
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Create a new language successfully',
    type: Language,
  })
  @ApiInternalServerError()
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @ApiTags('language')
  @Get()
  @Auth(UserRole.GRADUATE)
  @ApiOkResponse({
    description: 'Returns an array of ALL languages',
    type: [Language],
  })
  @ApiInternalServerError()
  findAll() {
    return this.languageService.findAll();
  }

  @ApiTags('language')
  @Get(':id')
  @Auth(UserRole.GRADUATE)
  @ApiOkResponse({
    description: 'Return one language',
    type: Language,
  })
  @ApiException(() => NotFoundException, {
    description: 'Language not found',
  })
  @ApiInternalServerError()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.findOne(id);
  }

  @ApiTags('admin-language')
  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Update one language successfully',
    type: MessageDTO,
  })
  @ApiInternalServerError()
  @ApiException(() => NotFoundException, {
    description: 'Language not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @ApiTags('admin-language')
  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Delete one language successfully',
    type: MessageDTO,
  })
  @ApiInternalServerError()
  @ApiException(() => NotFoundException, {
    description: 'Language not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.languageService.remove(id);
  }
}
