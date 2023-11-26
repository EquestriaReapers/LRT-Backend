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
} from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../constants';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from '../../common/interface/user-active-interface';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { ExperienceCreateResponse } from './dto/response.dto';
import { Experience } from './entities/experience.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import {
  EXPERIENCE_SUCCESFULLY_DELETED,
  EXPERIENCE_SUCCESFULLY_UPDATED,
} from './messages';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';

@ApiTags('experience')
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Auth(UserRole.GRADUATE)
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL experiences',
    type: [ExperienceCreateResponse],
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  findAll() {
    return this.experienceService.findAll();
  }

  @Auth(UserRole.GRADUATE)
  @Get(':id')
  @ApiOkResponse({
    description: 'Return one experience',
    type: ExperienceCreateResponse,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(+id);
  }

  @Auth(UserRole.GRADUATE)
  @Post('/my-experience')
  @ApiOkResponse({
    description: 'Return one experience',
    type: Experience,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  createMyExperiencia(
    @Body() createExperienceDto: CreateExperienceDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.experienceService.createMyExperience(createExperienceDto, user);
  }

  @Auth(UserRole.ADMIN)
  @Post()
  @ApiOkResponse({
    description: 'Return one experience',
    type: Experience,
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }

  @Auth(UserRole.GRADUATE)
  @Patch('/my-experience/:id')
  @ApiOkResponse({
    description: 'Update my experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async updateMyExperiencia(
    @Param('id') id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.experienceService.updateMyExperience(
      id,
      updateExperienceDto,
      user,
    );

    return response.status(200).json({
      message: EXPERIENCE_SUCCESFULLY_UPDATED,
    });
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async update(
    @Param('id') id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
    @Response() response: express.Response,
  ) {
    await this.experienceService.update(+id, updateExperienceDto);

    return response.status(200).json({
      message: EXPERIENCE_SUCCESFULLY_UPDATED,
    });
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async remove(
    @Param('id') id: string,
    @Response() response: express.Response,
  ) {
    await this.experienceService.remove(+id);

    return response.status(200).json({
      message: EXPERIENCE_SUCCESFULLY_DELETED,
    });
  }
}
