import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/constants';
import { Profile } from 'src/core/profiles/entities/profile.entity';

export interface CreateProfileResponseDTOI {
  perfil: Profile;
  token: {
    expiresIn: string;
    token: any;
  };
  id: number;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  role: UserRole;
  deletedAt: Date;
}

export default class CreateProfileResponseDTO
  implements CreateProfileResponseDTOI
{
  @ApiProperty()
  perfil: Profile;
  @ApiProperty()
  token: {
    expiresIn: string;
    token: any;
  };
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  verified: boolean;
  @ApiProperty()
  role: UserRole;
  @ApiProperty()
  deletedAt: Date;
}
