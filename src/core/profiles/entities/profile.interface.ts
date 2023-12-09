import { ExperienceI } from 'src/core/experience/entities/experience.interface';
import { SkillI } from 'src/core/skills/entities/skill.interface';
import { UserI } from 'src/core/users/entities/user.interface';
import { Carrera } from './profile.entity';

export interface ProfileI {
  id?: number;
  userId?: number;
  user?: UserI;
  description?: string;
  mainTitle?: string;
  countryResidence?: string;
  experience?: ExperienceI[];
  skills?: SkillI[];
  carrera?: Carrera
}
