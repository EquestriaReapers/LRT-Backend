import { Controller, Get, Post, Body, Patch, Param, Delete, InternalServerErrorException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { LanguagesService } from './service/languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/core/auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';
import { Language } from './entities/language.entity';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';
import { MessageDTO } from 'src/common/dto/response.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) { }

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Create a new language successfully',
    type: Language,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  @Auth(UserRole.GRADUATE || UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Returns an array of ALL languages',
    type: [Language],
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':id')
  @Auth(UserRole.GRADUATE || UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Return one language',
    type: Language,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Language not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.languagesService.findOne(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Update one language successfully',
    type: MessageDTO,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Language not found',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLanguageDto: UpdateLanguageDto) {
    return this.languagesService.update(id, updateLanguageDto);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Delete one language successfully',
    type: MessageDTO,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Language not found',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.languagesService.remove(id);
  }
}

