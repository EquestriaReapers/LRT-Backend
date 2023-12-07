import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../entities/profile.entity';
import { Skill } from 'src/core/skills/entities/skill.entity';
import { Experience } from 'src/core/experience/entities/experience.entity';
import { User } from 'src/core/users/entities/user.entity';

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
  businessName: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  description: string;
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

export class PaginationMessage {
  @ApiProperty()
  itemCount: number;
  @ApiProperty()
  totalItems: number;
  @ApiProperty()
  itemsPerPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  randomSeed: number;
}

export class ResponseProfile {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({
    type: UserProfileData,
  })
  user: User;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mainTitle: string;

  @ApiProperty()
  countryResidence: string;

  @ApiProperty({
    type: [ExperienceData],
  })
  experience: Experience[];

  @ApiProperty({
    type: [SkillData],
  })
  skills: Skill[];

  @ApiProperty()
  deletedAt: Date;
}

export class ResponsePaginationProfile {
  @ApiProperty({
    type: Profile,
  })
  profiles: ResponseProfile[];

  @ApiProperty({
    type: PaginationMessage,
  })
  pagination: PaginationMessage;
}
