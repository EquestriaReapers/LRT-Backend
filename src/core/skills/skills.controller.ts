import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Response,
  Query,
} from '@nestjs/common';
import { SkillsService } from './service/skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../constants';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';
import { Skill } from './entities/skill.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import {
  SKILL_SUCCESFULLY_DELETED,
  SKILL_SUCCESFULLY_UPDATED,
} from './messages';

@ApiTags('skill')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Auth(UserRole.GRADUATE)
  @Post()
  @ApiCreatedResponse({
    description: 'Returns the created skill',
    type: Skill,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Auth(UserRole.GRADUATE || UserRole.ADMIN)
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL skills',
    type: [Skill],
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  findAll(@Query('name') name: string) {
    return this.skillsService.findAll(name);
  }

  @Auth(UserRole.GRADUATE || UserRole.ADMIN)
  @Get(':id')
  @ApiOkResponse({
    description: 'Return one skill',
    type: Skill,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Skill not found',
  })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update one skill successfully',
    type: MessageDTO,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Skill not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateSkillDto: UpdateSkillDto,
    @Response() response: express.Response,
  ) {
    await this.skillsService.update(+id, updateSkillDto);

    return response.status(200).json({
      message: SKILL_SUCCESFULLY_UPDATED,
    });
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete one skill successfully',
    type: MessageDTO,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Skill not found',
  })
  async remove(
    @Param('id') id: string,
    @Response() response: express.Response,
  ) {
    await this.skillsService.remove(+id);

    return response.status(200).json({
      message: SKILL_SUCCESFULLY_DELETED,
    });
  }
}
