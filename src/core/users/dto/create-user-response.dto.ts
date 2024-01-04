import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/constants';

export class UserData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  verified: boolean;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  deletedAt: Date;
}

export class ProfileData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mainTitle: string;

  @ApiProperty()
  countryResidence: string;

  @ApiProperty()
  deleteAt: Date;
}

export class UserCreateResponse {
  @ApiProperty({ type: UserData })
  user: UserData;

  @ApiProperty({ type: ProfileData })
  profile: ProfileData;

  @ApiProperty()
  expiresIn: string;

  @ApiProperty()
  token: string;
}
