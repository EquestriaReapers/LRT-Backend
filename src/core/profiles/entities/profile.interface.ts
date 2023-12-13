import { Career } from 'src/core/career/enum/career.enum';
import { ExperienceI } from 'src/core/experience/entities/experience.interface';
import { SkillI } from 'src/core/skills/entities/skill.interface';
import { UserI } from 'src/core/users/entities/user.interface';

export interface ProfileI {
  id?: number;
  userId?: number;
  user?: UserI;
  description?: string;
  mainTitle?: Career;
  countryResidence?: string;
  experience?: ExperienceI[];
  skills?: SkillI[];
}
