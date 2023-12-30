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
} from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { ExperienceCreateResponseDTO } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}
  @ApiTags('experience')
  @Auth(UserRole.GRADUATE)
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL experiences',
    type: [ExperienceCreateResponse],
  })
  @ApiInternalServerError()
  findAll() {
    return this.experienceService.findAll();
  }
  @ApiTags('experience')
  @Auth(UserRole.GRADUATE)
  @Get(':id')
  @ApiOkResponse({
    description: 'Return one experience',
    type: ExperienceCreateResponse,
  })
  @ApiInternalServerError()
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(+id);
  }
  @ApiTags('experience')
  @Auth(UserRole.GRADUATE)
  @Post('/my-experience')
  @ApiCreatedResponse({
    description: 'Return one experience',
    type: Experience,
  })
  @ApiInternalServerError()
  createMyExperiencia(
    @Body() createExperienceDto: ExperienceCreateResponseDTO,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.experienceService.createMyExperience(createExperienceDto, user);
  }
  @ApiTags('admin-experience')
  @Auth(UserRole.ADMIN)
  @Post()
  @ApiCreatedResponse({
    description: 'Return one experience',
    type: Experience,
  })
  @ApiInternalServerError()
  create(@Body() createExperienceDto: ExperienceCreateResponseDTO) {
    return this.experienceService.create(createExperienceDto);
  }
  @ApiTags('experience')
  @Auth(UserRole.GRADUATE)
  @Patch('/my-experience/:id')
  @ApiOkResponse({
    description: 'Update my experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiInternalServerError()
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

  @ApiTags('experience')
  @Auth(UserRole.GRADUATE)
  @Delete('/my-experience/:id')
  @ApiOkResponse({
    description: 'Delete my experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiInternalServerError()
  async removeMyExperience(
    @Param('id') id: number,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.experienceService.removeMyExperience(id, user);

    return response.status(200).json({
      message: EXPERIENCE_SUCCESFULLY_DELETED,
    });
  }

  @ApiTags('admin-experience')
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiInternalServerError()
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

  @ApiTags('admin-experience')
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete experience successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Experience not found',
  })
  @ApiInternalServerError()
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
