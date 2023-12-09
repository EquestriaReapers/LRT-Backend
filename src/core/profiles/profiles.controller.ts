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
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import ProfilesService from './service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../constants';
import { ActiveUser } from '../../common/decorator/active-user-decorator';
import { UserActiveInterface } from '../../common/interface/user-active-interface';
import { AddSkillDto } from './dto/add-skill.dto';
import { Carrera, Profile } from './entities/profile.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import {
  PROFILE_SUCCESFULLY_DELETED_LANGUAGE,
  PROFILE_SUCCESFULLY_DELETED_SKILL,
  PROFILE_SUCCESFULLY_UPDATED,
} from './messages';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  AddSkillResponse,
  ResponseProfileGet,
  SwaggerResponsePagination,
} from './dto/responses.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';
import { ApiQuery } from '@nestjs/swagger';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
import LanguageAction from './service/language.action';
import { LanguageProfile } from './entities/language-profile.entity';
import { AddLanguageDto } from './dto/add-language.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly languageAction: LanguageAction,
  ) {}

  @ApiTags('profile')
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL profiles',
    type: SwaggerResponsePagination,
  })
  @ApiInternalServerError()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'random', required: false })
  @ApiQuery({ name: 'carrera', required: false })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('random') random: number,
    @Query('carrera') carrera: Carrera[],
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.profilesService.findAllPaginate({
      page,
      limit,
      random,
      carrera,
    });
  }

  @ApiTags('profile')
  @Get(':id')
  @ApiInternalServerError()
  @ApiResponse({
    status: 200,
    description: 'Return the profile',
    type: ResponseProfileGet,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found',
  })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Patch('/my-profile')
  @ApiOkResponse({
    description: 'Update my profile successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found',
  })
  @ApiException(() => NotFoundException, {
    description: 'User not found',
  })
  @ApiInternalServerError()
  async updateMyProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.profilesService.updateMyProfile(updateProfileDto, user);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_UPDATED,
    });
  }

  @ApiTags('admin-profile')
  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiOkResponse({
    status: 200,
    description: 'When you update the profile successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'When you cant find the profile',
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found',
  })
  @ApiInternalServerError()
  async update(
    @Param('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @Response() response: express.Response,
  ) {
    await this.profilesService.update(+userId, updateProfileDto);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_UPDATED,
    });
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Post('/my-profile/skill')
  @ApiOkResponse({
    description: 'Return my profile with skills',
    type: AddSkillResponse,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found or skill not found',
  })
  @ApiInternalServerError()
  addSkillProfile(
    @Body() addSkillDto: AddSkillDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.profilesService.addSkillProfile(addSkillDto.skillId, user);
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Delete('/my-profile/skill/:skillId')
  @ApiOkResponse({
    description: 'Delete skill from my profile',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found or skill not found',
  })
  @ApiInternalServerError()
  async removeSkillProfile(
    @Param('skillId') skillId: number,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.profilesService.removeSkillProfile(skillId, user);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_DELETED_SKILL,
    });
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Post('/my-profile/language')
  @ApiOkResponse({
    description: 'Return my profile with languages',
    type: LanguageProfile,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found or language not found',
  })
  @ApiInternalServerError()
  addLanguageProfile(
    @Body() addLanguageProfile: AddLanguageDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.languageAction.add(addLanguageProfile, user);
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Delete('/my-profile/language/:languageId')
  @ApiOkResponse({
    description: 'Delete language from my profile',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found or language not found',
  })
  @ApiInternalServerError()
  async removeLanguageProfile(
    @Param('languageId') languageId: number,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.languageAction.remove(languageId, user);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_DELETED_LANGUAGE,
    });
  }

  @ApiTags('admin-profile')
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiInternalServerError()
  @ApiException(() => NotFoundException, {
    description: 'Profile not found',
  })
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
