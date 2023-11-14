import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../auth/interface/jwt-payload.interface';


@Injectable()
export class JwtPayloadService {
  constructor(private readonly jwtService: JwtService) {}

  createJwtPayload(user) {
    const data: JwtPayload = {
      email: user.email,
      role: user.role,
    };

    let jwt;
    try {
      jwt = this.jwtService.sign(data);
    } catch (error) {
      throw new HttpException(
        'Internal Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      expiresIn: "31d",
      token: jwt,
    };
  }
}
