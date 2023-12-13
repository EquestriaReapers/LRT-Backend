import { Injectable } from '@nestjs/common';
import { ContactItem, Icon, ProfileTemplate, SkillSetType } from './types';
import { ContactMethod } from 'src/core/profiles/entities/contact-method.entity';
import { TypeContact } from 'src/constants';
import { ResponseProfileGet } from '../../dto/responses.dto';

const ContactMethodTypeToIcon = {
  [TypeContact.PHONE]: Icon.Call,
  [TypeContact.EMAIL]: Icon.Mail,
};

@Injectable()
export default class ProfileTemplateAdaptator {
  async execute(profile: ResponseProfileGet): Promise<ProfileTemplate> {
    return {
      fullName: profile.user.name + ' ' + profile.user.lastname,
      mainTitle:
        `${profile.mainTitle.charAt(0).toUpperCase()}` +
        `${profile.mainTitle.slice(1).toLowerCase()}`,
      contactItems: this.getContactMethods(profile),
      experiences: profile.experience.map((exp) => ({
        company: exp.businessName,
        role: exp.role,
        location: exp.location,
        temporality: this.getTemporality(exp.startDate, exp.endDate),
        description: exp.description,
      })),
      educations: [],
      languages: profile.languages.map((lang) => lang.name),
      skillSet: {
        type: SkillSetType.Single,
        skills: profile.skills.map((skill) => skill.name),
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

    return [...countryLocationMethod, ...otherContactMethods];
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
}