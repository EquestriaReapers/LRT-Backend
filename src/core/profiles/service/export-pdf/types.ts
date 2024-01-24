export interface Experiencie {
  company: string;
  role: string;
  location: string | null;
  temporality: string;
  description: string | null;
}

export enum SkillSetType {
  Single = 'single',
  HardSoft = 'hard-soft',
}

export interface SingleSkillSet {
  type: SkillSetType.Single;
  skills: string[];
}

export interface MultipleSkillSet {
  type: SkillSetType.HardSoft;
  hardSkills: string[];
  softSkills: string[];
}

export type SkillSet = SingleSkillSet | MultipleSkillSet;

export interface Education {
  temporality: string | null;
  title: string;
  where: string | null;
}

export enum Icon {
  Call = 'call',
  Globe = 'globe',
  Mail = 'mail',
  Location = 'location',
}

export interface ContactItem {
  iconName: Icon;
  text: string;
}

export interface Professional {
  fullName: string;
  mainTitle: string;
}

export interface Lenguague {
  name: string;
  level: string | null;
}

export interface ProfileTemplate extends Professional {
  contactItems: ContactItem[];
  experiences: Experiencie[];
  educations: Education[];
  languages: Lenguague[];
  skillSet: SkillSet;
  profileUrl: string;
}
