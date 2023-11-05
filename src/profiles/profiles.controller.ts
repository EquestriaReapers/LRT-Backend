import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfilesService } from './service/profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

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

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto, @UploadedFile() file: Express.Multer.File) {
    return this.profilesService.update(+id, updateProfileDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
