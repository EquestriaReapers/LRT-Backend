import { Carrera } from '../entities/profile.entity';

export class FindAllPayload {
  page: number;
  limit: number;
  random: number;
  carrera: Carrera[];
}
