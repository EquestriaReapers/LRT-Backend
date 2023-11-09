import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfilesService } from './service/profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { AddSkillDto } from './dto/add-skill.dto';
@ApiTags('profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  
  @Auth(UserRole.GRADUATE)
  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Auth(UserRole.GRADUATE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }
  
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage : diskStorage({
            destination : './uploads/profiles',
            filename : (req, file, cb) => {
              cb(null, file.originalname);
            }
        })
      }
    )
  )

  @Auth(UserRole.GRADUATE)
  @Patch('/my-profile')
  updateMyProfile(@Body() updateProfileDto: UpdateProfileDto, @UploadedFile() file: Express.Multer.File,  @ActiveUser() user: UserActiveInterface) {
    return this.profilesService.updateMyProfile(updateProfileDto, file, user);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.update(+id, updateProfileDto, file);
  }

  @Auth(UserRole.GRADUATE)
  @Post('/my-profile/add-skill')
  addAnimeToList(@Body() addSkillDto: AddSkillDto, @ActiveUser() user: UserActiveInterface) {
    return this.profilesService.addSkillProfile(addSkillDto.skillId, user);
  }

  @Auth(UserRole.GRADUATE)
  @Post('/my-profile/remove-skill')
  removeSkillProfile(@Body() addSkillDto: AddSkillDto, @ActiveUser() user: UserActiveInterface) {
    return this.profilesService.removeSkillProfile(addSkillDto.skillId, user);
  }


  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
