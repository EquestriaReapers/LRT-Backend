import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Response,
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
import {
  SuccessfullyLoginDTO,
  SuccessfullyRegisterDTO,
} from './dto/responses.dto';
import { MessageDTO } from 'src/common/dto/response.dto';
import {
  INVALID_TOKEN_EMAIL_MESSAGE,
  SUCCESSFULY_VERIFIED_EMAIL_MESSAGE,
} from './message';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({
    description: 'Returns the created user',
    type: SuccessfullyRegisterDTO,
  })
  @ApiException(() => BadRequestException, {
    description: 'User already exists',
  })
  @ApiInternalServerError()
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
    type: SuccessfullyLoginDTO,
  })
  @ApiException(() => UnauthorizedException, {
    description: 'Email or password incorrect',
  })
  @ApiInternalServerError()
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
  @ApiInternalServerError()
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
  @ApiInternalServerError()
  async verifyEmail(
    @Param('token') token: string,
    @Response() response: express.Response,
  ) {
    const verified = await this.authService.verifyEmail(token);
    if (verified) {
      return response.status(200).json({
        message: SUCCESSFULY_VERIFIED_EMAIL_MESSAGE,
      });
    } else {
      return response.status(403).json({
        message: INVALID_TOKEN_EMAIL_MESSAGE,
      });
    }
  }
}
