import { UserRole } from '../../../constants';

export interface JwtPayload {
  email: string;
  role: UserRole;
}
