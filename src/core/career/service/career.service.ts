import { BadRequestException, Injectable } from '@nestjs/common';
import { Carrera } from '../enum/career.enum';

@Injectable()
export class CareerService {
  findAll() {
    return {
      career: [Carrera],
    };
  }

  findOneByName(name: string) {
    if (!Object.values(Carrera).includes(name as any)) {
      throw new BadRequestException(`Invalid career name: ${name}`);
    }

    return {
      career: name,
    };
  }
}
