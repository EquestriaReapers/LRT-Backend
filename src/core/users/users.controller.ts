import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ConflictException,
  NotFoundException,
  Response,
} from '@nestjs/common';
import { UsersService } from './service/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Auth } from '../../core/auth/decorators/auth.decorator';
import { UserRole } from '../..//constants';
import { UserCreateResponse } from './dto/create-user-response.dto';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { User } from './entities/user.entity';
import { MessageDTO } from 'src/common/dto/response.dto';
import * as express from 'express';
import { USER_SUCCESFULLY_DELETE, USER_SUCCESFULLY_UPDATED } from './messages';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';

@ApiTags('admin-users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth(UserRole.ADMIN)
  @Post()
  @ApiCreatedResponse({
    status: 200,
    description: 'Response of user creation',
    type: UserCreateResponse,
  })
  @ApiException(() => BadRequestException, {
    description: 'Required attributes were missing',
  })
  @ApiException(() => ConflictException, {
    description: 'Email already exists',
  })
  @ApiInternalServerError()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Auth(UserRole.ADMIN)
  @Get()
  @ApiOkResponse({
    description: 'List All Users',
    type: [User],
  })
  @ApiInternalServerError()
  findAll() {
    return this.usersService.findAll();
  }

  @Auth(UserRole.ADMIN)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get user by id',
    type: User,
  })
  @ApiException(() => NotFoundException, {
    description: 'User not found',
  })
  @ApiInternalServerError()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Auth(UserRole.ADMIN)
  @Patch(':id')
  @ApiOkResponse({
    status: 200,
    description: 'User updated successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'User not found',
  })
  @ApiInternalServerError()
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Response() response: express.Response,
  ) {
    await this.usersService.update(+id, updateUserDto);

    return response.status(200).json({
      message: USER_SUCCESFULLY_UPDATED,
    });
  }
  @Auth(UserRole.ADMIN)
  @Delete(':id')
  @ApiOkResponse({
    status: 200,
    description: 'User deleted successfully',
    type: MessageDTO,
  })
  @ApiException(() => NotFoundException, {
    description: 'User not found',
  })
  @ApiInternalServerError()
  async remove(
    @Param('id') id: string,
    @Response() response: express.Response,
  ) {
    await this.usersService.remove(+id);

    return response.status(200).json({
      message: USER_SUCCESFULLY_DELETE,
    });
  }
}
