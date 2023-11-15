import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExperienceService } from './service/experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';

@ApiTags("experience")
@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Auth(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.experienceService.findAll();
  }

  @Auth(UserRole.GRADUATE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienceService.findOne(+id);
  }

  @Auth(UserRole.GRADUATE)
  @Get()
  findAllMy(@ActiveUser() user: UserActiveInterface) {
    return this.experienceService.findAllMy(user)
  }

  @Auth(UserRole.GRADUATE)
  @Post('/my-experience')
  createMyExperiencia(@Body() createExperienceDto: CreateExperienceDto, @ActiveUser() user: UserActiveInterface) {
    return this.experienceService.createMyExperiencia(createExperienceDto, user);
  }

  @Auth(UserRole.ADMIN)
  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experienceService.create(createExperienceDto);
  }



  @Auth(UserRole.GRADUATE)
  @Patch('/my-experience')
  updateMyExperiencia(@Body() updateExperienceDto: UpdateExperienceDto, @ActiveUser() user: UserActiveInterface) {
    return this.experienceService.updateMyExperiencia(updateExperienceDto, user);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experienceService.update(+id, updateExperienceDto);
  }

  @Auth(UserRole.GRADUATE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienceService.remove(+id);
  }
}

