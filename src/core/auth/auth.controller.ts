import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Response,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import { SuccessfullyLogin, SuccessfullyRegister } from './dto/responses.dto';
import { INTERNAL_SERVER_ERROR } from 'src/constants/messages/messagesConst';
import { MessageDTO } from 'src/common/dto/response.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'Returns the created user',
    type: SuccessfullyRegister,
  })
  @ApiException(() => BadRequestException, {
    description: 'User already exists',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authService.register(registerDto);
    await this.authService.createEmailToken(registerDto.email);
    const emailVerificationResponse = await this.sendEmailVerification(
      registerDto.email,
    );

    return {
      ...response,
      emailVerification: emailVerificationResponse,
    };
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Returns the token',
    type: SuccessfullyLogin,
  })
  @ApiException(() => UnauthorizedException, {
    description: 'Email or password incorrect',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('email/resend-verification/:email')
  @ApiOkResponse({
    description: 'Returns the message',
    type: MessageDTO,
  })
  @ApiException(() => ForbiddenException, {
    description: 'user not found',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async sendEmailVerification(@Param('email') email: string) {
    await this.authService.createEmailToken(email);
    return await this.authService.sendEmailVerification(email);
  }

  @Get('email/verify/:token')
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: MessageDTO,
  })
  @ApiException(() => UnauthorizedException, {
    description: 'Token invalid',
  })
  @ApiException(() => InternalServerErrorException, {
    description: INTERNAL_SERVER_ERROR,
  })
  async verifyEmail(
    @Param('token') token: string,
    @Response() response: express.Response,
  ) {
    const verified = await this.authService.verifyEmail(token);
    if (verified) {
      return response.status(200).json({
        message: 'Correo verificado con exito',
      });
    } else {
      return response.status(403).json({
        message: 'Token invalido',
      });
    }
  }
}