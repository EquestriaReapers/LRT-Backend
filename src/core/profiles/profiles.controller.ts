import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Response,
  NotFoundException,
} from '@nestjs/common';
import { ProfilesService } from './service/profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiOkResponse,
  ApiResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import {
  MY_PROFILE_SUCCESFULLY_UPDATED,
  PROFILE_SUCCESFULLY_UPDATED,
} from './messages';
import * as express from 'express';
import { MessageDTO } from 'src/common/dto/response.dto';
import { Profile } from './entities/profile.entity';

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

  // UPDATE MY PROFILE
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profiles',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  @Auth(UserRole.GRADUATE)
  @Patch('/my-profile')
  @ApiResponse({ status: 200, description: MY_PROFILE_SUCCESFULLY_UPDATED })
  async updateMyProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.profilesService.update(+user.id, updateProfileDto, file);

    return response.status(200).json({
      message: MY_PROFILE_SUCCESFULLY_UPDATED,
    });
  }

  // UPDATE
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
    @Param('id') id: number,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Response() response: express.Response,
  ) {
    await this.profilesService.update(+id, updateProfileDto, file);

    return response.status(200).json({
      message: PROFILE_SUCCESFULLY_UPDATED,
    });
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
