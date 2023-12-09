import { Icon, ProfileTemplate, SkillSetType } from './types';

export function getDummyProfileTemplate(
  skillSetType: SkillSetType,
): ProfileTemplate {
  return {
    fullName: 'John Doe',
    mainTitle: 'Full Stack Developer',
    contactItems: [
      { iconName: Icon.Call, text: '0426-6589849' },
      { iconName: Icon.Globe, text: 'www.abcdefg.com' },
      { iconName: Icon.Mail, text: 'persona@correo.com' },
      { iconName: Icon.Location, text: 'Ciudad Guayana, Venezuela' },
    ],
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
    skillSet:
      skillSetType === SkillSetType.HardSoft
        ? {
            type: SkillSetType.HardSoft,
            hardSkills: [
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
            ],
            softSkills: [
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
          }
        : {
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
