import { ApiProperty } from '@nestjs/swagger';

export class UserProfileData {
  @ApiProperty()
  name: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  email: string;
}

export class ExperienceData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  startDate: Date;
  @ApiProperty()
  endDate: Date;
}

export class SkillData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  level: string;
}

export class AddSkillResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  mainTitle: string;
  @ApiProperty()
  countryResidence: string;
  @ApiProperty()
  deleteAt: Date;
  @ApiProperty({
    type: [SkillData],
  })
  skills: SkillData[];
}
