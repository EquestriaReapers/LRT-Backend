import { ApiProperty } from '@nestjs/swagger';
import { Skill, SkillType } from 'src/core/skills/entities/skill.entity';
import { Experience } from 'src/core/experience/entities/experience.entity';
import { User } from 'src/core/users/entities/user.entity';
import { Career } from 'src/core/career/enum/career.enum';

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

export class EducationData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  principal: boolean;
  @ApiProperty()
  isUCAB: boolean;
  @ApiProperty()
  title: string;
  @ApiProperty()
  entity: string;
  @ApiProperty()
  endDate: Date;
}

export class SkillData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: SkillType })
  type: SkillType;
  @ApiProperty()
  skillProfileId: number;
  @ApiProperty()
  isVisible: boolean;
}

export class AddSkillResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  mainTitle: Career;
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

export class LanguageProfileData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  level: string;
  @ApiProperty()
  languageId: number;
}

export class SkillProfileData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  profileId: number;

  @ApiProperty()
  skillId: number;

  @ApiProperty()
  isVisible: boolean;
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
  mainTitle: Career;

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

  @ApiProperty({
    type: [LanguageProfileData],
  })
  languageProfile: LanguageProfileData[];

  @ApiProperty()
  deletedAt: Date;
}

export class LanguageProfileDataExtend {
  @ApiProperty()
  id: number;
  @ApiProperty()
  profileId: number;
  @ApiProperty()
  level: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  languageId: number;
}

export class ResponsePaginationProfile {
  @ApiProperty({
    type: ResponseProfile,
  })
  profiles: ResponseProfile[];

  @ApiProperty({
    type: PaginationMessage,
  })
  pagination: PaginationMessage;
}

export class ProfileData {
  @ApiProperty()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  description: string;
  @ApiProperty()
  mainTitle: Career;
  @ApiProperty()
  countryResidence: string;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty({
    type: [ExperienceData],
  })
  experience: Experience[];
  @ApiProperty({
    type: [SkillData],
  })
  skills: Skill[];
}

export class MethodContact {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;
}

export class PortfolioData {
  @ApiProperty()
  id: number;

  @ApiProperty()
  profileId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  dateEnd: Date;

  @ApiProperty()
  imagePrincipal: string;

  @ApiProperty()
  image: string[];
}

export class ResponseMethodContactDTO {
  @ApiProperty({
    type: ProfileData,
  })
  profile: ProfileData;
  @ApiProperty({
    type: [MethodContact],
  })
  contactMethods: MethodContact[];
}

export class ResponseProfileGet {
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

  @ApiProperty()
  website: string;

  @ApiProperty({
    type: [ExperienceData],
  })
  experience: Experience[];

  @ApiProperty({
    type: [SkillData],
  })
  skills: SkillData[];

  @ApiProperty({
    type: [LanguageProfileDataExtend],
  })
  languages: LanguageProfileDataExtend[];

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({
    type: [MethodContact],
  })
  contactMethods: MethodContact[];

  @ApiProperty({
    type: [EducationData],
  })
  education: EducationData[];

  @ApiProperty({
    type: [PortfolioData],
  })
  portfolio: PortfolioData[];
}

export class SwaggerResponsePagination {
  @ApiProperty({
    type: ResponsePaginationProfile,
  })
  profiles: ResponsePaginationProfile[];

  @ApiProperty({
    type: PaginationMessage,
  })
  pagination: PaginationMessage;
}
