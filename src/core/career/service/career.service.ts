import { BadRequestException, Injectable } from '@nestjs/common';
import { Career } from '../enum/career.enum';

@Injectable()
export class CareerService {
  findAll() {
    return {
      career: [Career],
    };
  }

  findOneByName(name: string) {
    if (!Object.values(Career).includes(name as any)) {
      throw new BadRequestException(`Invalid career name: ${name}`);
    }

    return {
      career: name,
    };
  }
}
