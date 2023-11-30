import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { INVALID_TOKEN, NO_TOKEN_PROVIDED_MESSAGE } from '../message';
import { envData } from 'src/config/datasource';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(NO_TOKEN_PROVIDED_MESSAGE);
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envData.JWTSECRET,
      });

      request.user = payload;
    } catch {
      throw new UnauthorizedException(INVALID_TOKEN);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
