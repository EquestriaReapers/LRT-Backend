import { BadRequestException, Injectable } from '@nestjs/common';
import { Career } from '../enum/career.enum';

@Injectable()
export class CareerService {
  findAll() {
    const careers = {};
    Object.keys(Career).forEach((key) => {
      const newKey = key.replace(/_/g, ' ');
      careers[Career[key]] = newKey;
    });
    return careers;
  }

  findOneByName(name: string) {
    if (!Object.values(Career).includes(name as any)) {
      throw new BadRequestException(`Nombre de carrera invalida: ${name}`);
    }

    return {
      career: name,
    };
  }
}
