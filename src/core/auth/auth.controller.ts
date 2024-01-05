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
  HttpException,
  HttpStatus,
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
  ERROR_RESETTING_PASSWORD_MESSAGE,
  ERROR_SENDING_FORGOT_PASSWORD_EMAIL_MESSAGE,
  INVALID_RESET_PASSWORD_TOKEN_MESSAGE,
  INVALID_TOKEN_EMAIL_MESSAGE,
  SUCCESSFULY_RESET_PASSWORD_MESSAGE,
  SUCCESSFULY_SEND_FORGOT_PASSWORD_EMAIL_MESSAGE,
  SUCCESSFULY_VERIFIED_EMAIL_MESSAGE,
} from './message';
import { ApiInternalServerError } from 'src/common/decorator/internal-server-error-decorator';
import * as bcrypt from 'bcrypt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from '../users/service/users.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly usersService: UsersService,

  ) { }

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

  @Get('email/forgot-password/:email')
  async sendEmailForgotPassword(@Param('email') email: string): Promise<Object> {
    try {
      var isEmailSent = await this.authService.sendEmailForgotPassword(email);
      if (isEmailSent) {
        return { status: 'success', code: 'RESULT_SUCCESS', message: SUCCESSFULY_SEND_FORGOT_PASSWORD_EMAIL_MESSAGE };
      } else {
        return { status: 'error', code: 'RESULT_FAIL', message: ERROR_SENDING_FORGOT_PASSWORD_EMAIL_MESSAGE };
      }
    } catch (error) {
      return { status: 'error', code: 'RESULT_FAIL', message: "Error when sending email" };
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;
    const result = await this.authService.resetPassword(token, newPassword);

    if (result) {
      return { message: SUCCESSFULY_RESET_PASSWORD_MESSAGE };
    } else {
      throw new HttpException(ERROR_RESETTING_PASSWORD_MESSAGE, HttpStatus.BAD_REQUEST);
    }
  }
}
