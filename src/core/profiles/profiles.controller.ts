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
  ParseIntPipe,
} from '@nestjs/common';
import ProfilesService from './service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../../constants';
import { ActiveUser } from '../../common/decorator/active-user-decorator';
import { UserActiveInterface } from '../../common/interface/user-active-interface';
import { AddSkillDto } from './dto/add-skill.dto';
import { Profile } from './entities/profile.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import {
  PROFILE_SUCCESFULLY_DELETED_SKILL,
  PROFILE_SUCCESFULLY_DELETE_METHOD_CONTACT,
  PROFILE_SUCCESFULLY_UPDATED,
} from './messages';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  AddSkillResponse,
  ResponseMethodContactDTO,
  ResponsePaginationProfile,
} from './dto/responses.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';
import { ApiQuery } from '@nestjs/swagger';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
import { CreateContactDto } from './dto/createContact.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Get()
  @ApiOkResponse({
    description: 'Returns an array of ALL profiles',
    type: ResponsePaginationProfile,
  })
  @ApiInternalServerError()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'random', required: false })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('random') random: number,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.profilesService.findAllPaginate({
      page,
      limit,
      random,
    });
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Get(':id')
  @ApiInternalServerError()
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

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @ApiCreatedResponse({
    description: 'Add contact method to my profile',
    type: ResponseMethodContactDTO,
  })
  @Post('/my-profile/contact-methods')
  async addContactMethod(
    @ActiveUser() user: UserActiveInterface,
    @Body() createContactMethodDto: CreateContactDto,
  ) {
    return this.profilesService.addContactMethod(user, createContactMethodDto);
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @Get('/my-profile/contact-methods')
  async getContactMethods(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.getContactMethods(id);
  }

  @ApiTags('profile')
  @Auth(UserRole.GRADUATE)
  @ApiOkResponse({
    description: 'Delete contact method from my profile',
    type: MessageDTO,
  })
  @Delete('/my-profile/contact-methods/:id')
  async deleteContactMethod(
    @Param('id', ParseIntPipe) id: number,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.profilesService.removeContactMethod(id, user);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_DELETE_METHOD_CONTACT,
    });
  }
}
