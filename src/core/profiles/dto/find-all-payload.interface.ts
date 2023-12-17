import { Career } from 'src/core/career/enum/career.enum';
import { Skill } from 'src/core/skills/entities/skill.entity';

export class FindAllPayload {
  page: number;
  limit: number;
  random: number;
  carrera: Career[];
  skills: string[];
}
