import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Response,
  Query,
} from '@nestjs/common';
import { SkillsService } from './service/skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../constants';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { Skill, SkillType } from './entities/skill.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import {
  SKILL_SUCCESFULLY_DELETED,
  SKILL_SUCCESFULLY_UPDATED,
} from './messages';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @ApiTags('skill')
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL skills',
    type: [Skill],
  })
  @ApiInternalServerError()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'A parameter. Optional',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'A parameter. Optional',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'A parameter. Optional',
  })
  @ApiQuery({
    name: 'exclude',
    required: false,
    description: 'A parameter. Optional',
  })
  async findAll(
    @Query('name') name?: string,
    @Query('type') type?: SkillType,
    @Query('limit') limit?: number,
    @Query('exclude') exclude?: Array<string>,
  ) {
    try {
      const skills = await this.skillsService.findAll(
        name,
        type,
        limit,
        exclude,
      );

      return skills;
    } catch (error) {
      throw new NotFoundException(INTERNAL_SERVER_ERROR);
    }
  }
  @ApiTags('skill')
  @Auth(UserRole.GRADUATE || UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Return one skill',
    type: Skill,
  })
  @ApiInternalServerError()
  @ApiException(() => NotFoundException, {
    description: 'Skill not found',
  })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id);
  }

  @ApiTags('admin-skill')
  @Auth(UserRole.ADMIN)
  @Post()
  @ApiCreatedResponse({
    description: 'Returns the created skill',
    type: Skill,
  })
  @ApiInternalServerError()
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @ApiTags('skill')
  @Auth(UserRole.GRADUATE)
  @Post('skill-user')
  @ApiCreatedResponse({
    description: 'Returns the created skill',
    type: Skill,
  })
  @ApiInternalServerError()
  async createSkillAndUserAsing(
    @Body() createSkillDto: CreateSkillDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    try {
      const response = await this.skillsService.createSkillAndUserAsing(
        createSkillDto,
        user,
      );

      return response;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(INTERNAL_SERVER_ERROR);
    }
  }

  @ApiTags('admin-skill')
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update one skill successfully',
    type: MessageDTO,
  })
  @ApiInternalServerError()
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

  @ApiTags('admin-skill')
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete one skill successfully',
    type: MessageDTO,
  })
  @ApiInternalServerError()
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
