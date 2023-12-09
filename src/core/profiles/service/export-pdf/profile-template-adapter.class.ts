import { Injectable } from '@nestjs/common';
import { ContactItem, Icon, ProfileTemplate, SkillSetType } from './types';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import { ContactMethod } from 'src/core/profiles/entities/contact-method.entity';
import { TypeContact } from 'src/constants';

const ContactMethodTypeToIcon = {
  [TypeContact.PHONE]: Icon.Call,
  [TypeContact.EMAIL]: Icon.Mail,
};

@Injectable()
export default class ProfileTemplateAdaptator {
  async execute(profile: Profile): Promise<ProfileTemplate> {
    return {
      fullName: profile.user.name + ' ' + profile.user.lastname,
      mainTitle: profile.mainTitle,
      contactItems: this.getContactMethods(profile),
      experiences: [
        {
          company: 'ABC Company',
          role: 'Full Stack Developer',
          location: null,
          temporality: '2018 - Present',
          description: `Company working in the area of IT, providing services and and software engineering solutions
        across a wide range of leading-edge technologies, including Big Data, analytics, machine learning, IoT, mobile, cloud,
        UI/UX, and test automation`,
        },
        {
          company: 'Space X',
          role: 'Frontend Developer',
          location: 'Canada, Toronto',
          temporality: '2016 - 2018',
          description: `Company working in the area of IT, providing services and and software engineering solutions
        across a wide range of leading-edge technologies, including Big Data, analytics, machine learning, IoT, mobile, cloud,
        UI/UX, and test automation`,
        },
        {
          company: 'Encora Inc, S.A.C.',
          role: 'Software Engineer III',
          location: 'Ciudad Guayana, Venezuela',
          temporality: '2014 - 2016',
          description: null,
        },
      ],
      educations: [
        {
          temporality: '2015',
          title: 'Computer engineering',
          where: 'Universidad Católica Andrés Bello',
        },
        {
          temporality: '2019',
          title: 'Education, Especial Education mention',
          where: 'Universidad Católica Andrés Bello',
        },
        {
          temporality: null,
          title: 'Figma, Course of design and prototyping',
          where: null,
        },
        {
          temporality: null,
          title: 'Excel, Course of formula and functions',
          where: 'Venezuela, Bolívar',
        },
      ],
      lenguagues: ['Spanish', 'English'],
      skillSet: {
        type: SkillSetType.Single,
        skills: [
          'Javascript',
          'Typescript',
          'HTML',
          'CSS',
          'SASS',
          'LESS',
          'React',
          'Angular',
          'Vue',
          'Node',
          'Leadership',
          'Teamwork',
          'Problem solving',
          'Creativity',
          'Communication',
          'Leadership',
          'Teamwork',
          'Problem solving',
          'Creativity',
        ],
      },
    };
  }

  private getContactMethods(profile: Profile): ContactItem[] {
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
          iconName: ContactMethodTypeToIcon[contactMethod.type],
          text: contactMethod.value,
        });
      });
    }

    return [...countryLocationMethod, ...otherContactMethods];
  }
}
