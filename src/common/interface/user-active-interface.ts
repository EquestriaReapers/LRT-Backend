import { UserRole } from 'src/constants';

export interface UserActiveInterface {
  id: number;
  email: string;
  role: UserRole;
}
