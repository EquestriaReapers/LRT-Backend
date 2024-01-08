import { ExperienceI } from 'src/core/experience/entities/experience.interface';
import { SkillI } from 'src/core/skills/entities/skill.interface';
import { UserI } from 'src/core/users/entities/user.interface';

export interface ProfileI {
  id?: number;
  userId?: number;
  user?: UserI;
  description?: string;
  mainTitle?: string;
  countryResidence?: string;
  website?: string;
  experience?: ExperienceI[];
  skills?: SkillI[];
}
