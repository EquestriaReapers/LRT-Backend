import { ApiProperty } from '@nestjs/swagger';
import { ProfileData } from 'src/core/users/dto/create-user-response.dto';

export class ExperienceCreateResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  businessName: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    type: ProfileData,
  })
  profile: ProfileData;
}
