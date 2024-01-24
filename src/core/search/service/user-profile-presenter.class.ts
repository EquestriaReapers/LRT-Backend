import { Injectable } from '@nestjs/common';
import { Profile } from '../../profiles/entities/profile.entity';

@Injectable()
export class UserProfilePresenter {
  public constructor() {}

  public format(profile: Profile): any {
    const { skillsProfile, languageProfile, ...otherProfileProps } = profile;

    const mappedProfile = {
      ...otherProfileProps,
      mainTitleCode: this.slugify(profile.mainTitle),
      languages: languageProfile
        ? languageProfile.map(({ language, ...lp }) => ({
            ...lp,
            name: language.name,
            nameCode: this.slugify(language.name),
          }))
        : [],
      skills: skillsProfile
        ? skillsProfile.map(({ skill, ...sp }) => ({
            id: skill.id,
            name: skill.name,
            nameCode: this.slugify(skill.name),
            type: skill.type,
            skillProfileId: sp.id,
            isVisible: sp.isVisible,
          }))
        : [],
    };

    return mappedProfile;
  }

  private slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim();
  }
}

/*
export interface ElasticProfile {
  id: number;
  userId: number;
  name: string;
  lastname: string;
  email: string;
  description: string;
  mainTitle: Career;
  mainTitleCode: string;
  countryResidence: string;
  website: string;
  skills: ElasticSkill[];
  experience: ElasticExperience[];
  portfolio: ElasticPortfolio[];
  education: ElasticEducation[];
  languages: ElasticLanguage[];
}

export interface ElasticSkill {
  id: number;
  name: string;
  nameCode: string;
  type: string;
  skillProfileId: number;
  isVisible: boolean;
}

export interface ElasticExperience {
  id: number;
  businessName: string;
  role: string;
  location: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  profileId: number;
}

export interface ElasticPortfolio {
  id: number;
  title: string;
  description: string;
  location: string;
  dateEnd: Date;
  profileId: number;
}

export interface ElasticEducation {
  id: number;
  title: string;
  entity: string;
  location: string;
  dateStart: Date;
  dateEnd: Date;
  profileId: number;
}

export interface ElasticLanguage {
  id: number;
  name: string;
  nameCode: string;
  level: string;
  languageProfileId: number;
}
*/
