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
import { ProfilesService } from './service/profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../constants';
import { ActiveUser } from '../../common/decorator/active-user-decorator';
import { UserActiveInterface } from '../../common/interface/user-active-interface';
import { AddSkillDto } from './dto/add-skill.dto';
import { Profile } from './entities/profile.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import {
  PROFILE_NOT_FOUND,
  PROFILE_SUCCESFULLY_DELETED_SKILL,
  PROFILE_SUCCESFULLY_UPDATED,
} from './messages';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { AddSkillResponse } from './dto/responses.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';

@ApiTags('profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Auth(UserRole.GRADUATE)
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL profiles',
    type: [Profile],
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('random') random: number,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.profilesService.findAll({
      page,
      limit,
      random,
    });
  }

  @Auth(UserRole.GRADUATE)
  @Get(':id')
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiResponse({
    status: 200,
    description: 'Return the profile',
    type: Profile,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found',
  })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

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
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
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

  @Auth(UserRole.GRADUATE)
  @Post('/my-profile')
  @ApiOkResponse({
    description: 'Return my profile with skills',
    type: AddSkillResponse,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found or skill not found',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  addSkillProfile(
    @Body() addSkillDto: AddSkillDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.profilesService.addSkillProfile(addSkillDto.skillId, user);
  }

  @Auth(UserRole.GRADUATE)
  @Delete('/my-profile')
  @ApiOkResponse({
    description: 'Delete skill from my profile',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found or skill not found',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async removeSkillProfile(
    @Body() addSkillDto: AddSkillDto,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.profilesService.removeSkillProfile(addSkillDto.skillId, user);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_DELETED_SKILL,
    });
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiException(() => NotFoundException, {
    description: 'Profile not found',
  })
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
