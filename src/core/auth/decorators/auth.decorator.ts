import {
  SetMetadata,
  UnauthorizedException,
  UseGuards,
  applyDecorators,
} from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { RolesGuard } from '../guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { UserRole } from '../../../constants';
import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';

export function Auth(roles: UserRole) {
  return applyDecorators(
    Roles(roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiException(() => UnauthorizedException, {
      description: 'User is not authorized',
    }),
  );
}
