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
import { ProfilesService } from './service/profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiNotFoundResponse,
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
import { PROFILE_SUCCESFULLY_UPDATED } from './messages';

@ApiTags('profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Auth(UserRole.GRADUATE)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retorna un arreglo de TODOS los perfiles',
    type: [Profile],
  })
  findAll() {
    return this.profilesService.findAll();
  }

  @Auth(UserRole.GRADUATE)
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Retorna un perfil',
    type: Profile,
  })
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Auth(UserRole.GRADUATE)
  @Patch('/my-profile')
  updateMyProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.profilesService.updateMyProfile(updateProfileDto, user);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    status: 200,
    description: 'Cuando actualiza el perfil con exito',
    type: MessageDTO,
  })
  @ApiNotFoundResponse({
    description: 'Cuando no encuentra el perfil del usuario',
    type: NotFoundException,
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
  addSkillProfile(
    @Body() addSkillDto: AddSkillDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.profilesService.addSkillProfile(addSkillDto.skillId, user);
  }

  @Auth(UserRole.GRADUATE)
  @Delete('/my-profile')
  removeSkillProfile(
    @Body() addSkillDto: AddSkillDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.profilesService.removeSkillProfile(addSkillDto.skillId, user);
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
