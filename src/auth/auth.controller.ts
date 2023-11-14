import { Controller, Get, Post, Body, Patch, Param, Delete, Response } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const response = this.authService.register(registerDto);
        await this.authService.createEmailToken(registerDto.email);
        const state = await this.sendEmailVerification(registerDto.email);

        return {
            ...response,
            ...state,
        }

    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiResponse({ status: 403, description: 'El usuario no se puede encontrar' })
    @Get('email/resend-verification/:email')
        async sendEmailVerification(@Param('email') email: string) {
        await this.authService.createEmailToken(email);
        return await this.authService.sendEmailVerification(email);
    }

    @ApiResponse({ status: 200, description: 'Successfully verified email' })
    @ApiResponse({ status: 403, description: 'Invalid token' })
    @Get('email/verify/:token')
    async verifyEmail(
        @Param('token') token: string,
        @Response() response: express.Response,
    ) {
        const verified = await this.authService.verifyEmail(token);
    if (verified) {
            response.redirect('http://localhost:3000');
            response.send('Email verified');
        }
    }
  
}
