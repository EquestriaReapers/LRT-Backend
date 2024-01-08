import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Response,
  InternalServerErrorException,
} from '@nestjs/common';
import { EducationService } from './service/education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import * as express from 'express';
import {
  EDUCATION_SUCCESFULLY_DELETED,
  EDUCATION_SUCCESFULLY_UPDATED,
} from './message';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from 'src/constants';

@ApiTags('education')
@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get('my-education/:idProfile')
  findAllEducation(@Param('idProfile') idProfile: number) {
    return this.educationService.findAll(idProfile);
  }

  @Get(':id')
  findOneEducation(@Param('id') id: number) {
    return this.educationService.findOne(id);
  }

  @Auth(UserRole.GRADUATE)
  @Post('my-education')
  create(
    @Body() createEducationDto: CreateEducationDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return this.educationService.create(createEducationDto, user);
  }

  @Auth(UserRole.GRADUATE)
  @Patch('my-education/:id')
  async update(
    @Param('id') id: number,
    @Body() updateEducationDto: UpdateEducationDto,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.educationService.update(id, updateEducationDto, user);

    return response.status(200).json({
      message: EDUCATION_SUCCESFULLY_UPDATED,
    });
  }

  @Auth(UserRole.GRADUATE)
  @Delete('my-education/:id')
  async remove(
    @Param('id') id: number,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.educationService.remove(id, user);

    return response.status(200).json({
      message: EDUCATION_SUCCESFULLY_DELETED,
    });
  }
}
