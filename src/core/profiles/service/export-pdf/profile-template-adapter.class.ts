import { Injectable } from '@nestjs/common';
import { ContactItem, Icon, ProfileTemplate, SkillSetType } from './types';
import { ContactMethod } from 'src/core/profiles/entities/contact-method.entity';
import { TypeContact } from 'src/constants';
import { ResponseProfileGet } from '../../dto/responses.dto';
import { SkillType } from 'src/core/skills/entities/skill.entity';

const ContactMethodTypeToIcon = {
  [TypeContact.PHONE]: Icon.Call,
  [TypeContact.EMAIL]: Icon.Mail,
  [TypeContact.GLOBE]: Icon.Globe,
  
};

@Injectable()
export default class ProfileTemplateAdaptator {
  async execute(profile: ResponseProfileGet): Promise<ProfileTemplate> {
    return {
      fullName: profile.user.name + ' ' + profile.user.lastname,
      mainTitle: this.getMainTitle(profile.mainTitle),
      contactItems: this.getContactMethods(profile),
      experiences: profile.experience.map((exp) => ({
        company: exp.businessName,
        role: exp.role,
        location: exp.location,
        temporality: this.getTemporality(exp.startDate, exp.endDate),
        description: exp.description,
      })),
      educations: profile.education.map((edu) => ({
        temporality: edu.endDate ? edu.endDate.getFullYear().toString() : null,
        title: edu.title,
        where: edu.entity,
      })),
      languages: profile.languages.map(({ name, level }) => ({
        name,
        level,
      })),
      skillSet: {
        type: SkillSetType.HardSoft,
        hardSkills: profile.skills
          .filter((skill) => skill.type === SkillType.HARD)
          .map((skill) => skill.name),
        softSkills: profile.skills
          .filter((skill) => skill.type === SkillType.SOFT)
          .map((skill) => skill.name),
      },
    };
  }

  private getContactMethods(profile: ResponseProfileGet): ContactItem[] {
    const countryLocationMethod = [];
    if (profile.countryResidence) {
      countryLocationMethod.push({
        iconName: Icon.Location,
        text: profile.countryResidence,
      });


    }

    const otherContactMethods = [];
    if (profile.contactMethods) {
      profile.contactMethods.forEach((contactMethod: ContactMethod) => {
        otherContactMethods.push({
          iconName: ContactMethodTypeToIcon['email'],
          text: contactMethod.email,
        });
      });
    }

    const globeContactMethod = [];
    if (profile.website) {
      globeContactMethod.push({
        iconName: ContactMethodTypeToIcon['globe'],
        text: profile.website,
      });
    }

    return [...countryLocationMethod, ...otherContactMethods, ...globeContactMethod];
  }

  private getTemporality(startDate: Date, endDate: Date): string {
    if (startDate && endDate) {
      return `${startDate.getFullYear()} - ${endDate.getFullYear()}`;
    }
    if (startDate && !endDate) {
      return `${startDate.getFullYear()} - Actualidad`;
    }
    return '';
  }

  private getMainTitle(mainTitle: string): string {
    if (mainTitle) {
      mainTitle = mainTitle
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return mainTitle;
    }

    return '';
  }
}
