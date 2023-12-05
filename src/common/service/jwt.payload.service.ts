import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../core/auth/interface/jwt-payload.interface';
import e from 'express';
import { ERROR_ON_DECODE_JWT_CODE_MESSAGE } from 'src/core/auth/message';

@Injectable()
export class JwtPayloadService {
  constructor(private readonly jwtService: JwtService) {}

  createJwtPayload({ email, role }) {
    const data: JwtPayload = {
      email,
      role,
    };

    let jwt = null;
    try {
      jwt = this.jwtService.sign(data);
    } catch (error) {
      throw new HttpException(
        ERROR_ON_DECODE_JWT_CODE_MESSAGE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      expiresIn: '31d',
      token: jwt,
    };
  }
}
