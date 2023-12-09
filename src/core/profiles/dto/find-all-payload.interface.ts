import { Carrera } from 'src/core/career/enum/career.enum';

export class FindAllPayload {
  page: number;
  limit: number;
  random: number;
  carrera: Carrera[];
}
