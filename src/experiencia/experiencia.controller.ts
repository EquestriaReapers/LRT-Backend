import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';
import { ExperienciaService } from './service/experiencia.service';
import { UpdateExperienciaDTO } from './dto/update-experiencia.dto';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';

@ApiTags('experiencia')
@Controller('experiencias')
export class ExperienciaController {
  constructor(private readonly experienciaService: ExperienciaService) { }


  @Auth(UserRole.GRADUATE)
  @Get()
  findAll() {
    return this.experienciaService.findAll();
  }

  @Auth(UserRole.GRADUATE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experienciaService.findOne(+id);
  }


  @Auth(UserRole.GRADUATE)
  @Patch('/my-profile')
  updateMyExperiencia(@Body() updateExperienciaDto: UpdateExperienciaDTO, @ActiveUser() user: UserActiveInterface) {
    return this.experienciaService.updateMyExperiencia(updateExperienciaDto, user);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateExperienciaDto: UpdateExperienciaDTO) {
    return this.experienciaService.update(+id, updateExperienciaDto);
  }

  @Auth(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experienciaService.remove(+id);
  }
}
