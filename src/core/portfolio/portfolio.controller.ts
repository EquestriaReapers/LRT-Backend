import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Response,
  UseGuards,
} from '@nestjs/common';
import { PortfolioService } from './service/portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  UserRole,
  editFileName,
  imageFileFilter,
  validateImageFile,
} from 'src/constants';
import { ActiveUser } from 'src/common/decorator/active-user-decorator';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { FilesToBodyInterceptor } from 'src/common/class/customClassMulter';
import * as express from 'express';
import {
  PORTFOLIO_SUCCESSFULLY_DELETED,
  PORTFOLIO_SUCCESSFULLY_UPDATED,
} from './message';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':idProfile')
  findAll(@Param('idProfile') idProfile: number) {
    return this.portfolioService.findAll(+idProfile);
  }

  @Get('/project/:id')
  findOne(@Param('id') id: number) {
    return this.portfolioService.findOne(+id);
  }

  @Auth(UserRole.GRADUATE)
  @ApiBody({ type: CreatePortfolioDto })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagePrincipal', maxCount: 1 },
        { name: 'image', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/portfolio',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
    FilesToBodyInterceptor,
  )
  async create(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @ActiveUser() user: UserActiveInterface,
  ) {
    return await this.portfolioService.create(createPortfolioDto, user);
  }

  @Auth(UserRole.GRADUATE)
  @ApiBody({ type: UpdatePortfolioDto })
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'imagePrincipal', maxCount: 1 },
        { name: 'image', maxCount: 3 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/portfolio',
          filename: editFileName,
        }),
        fileFilter: imageFileFilter,
      },
    ),
    FilesToBodyInterceptor,
  )
  async update(
    @Param('id') id: number,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @ActiveUser() user: UserActiveInterface,
    @Response() response: express.Response,
  ) {
    await this.portfolioService.update(+id, updatePortfolioDto, user);
    return response.status(200).send({
      message: PORTFOLIO_SUCCESSFULLY_UPDATED,
    });
  }

  @Auth(UserRole.GRADUATE)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Response() response: express.Response,
    @ActiveUser() user: UserActiveInterface,
  ) {
    await this.portfolioService.remove(+id, user);

    return response.status(200).send({
      message: PORTFOLIO_SUCCESSFULLY_DELETED,
    });
  }
}
