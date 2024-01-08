import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { envData } from 'src/config/datasource';
import { CareerI } from '../carrer.interface';

@Injectable()
export class CareerService {
  constructor(private readonly httpService: HttpService) {}
  async findAll(search: string) {
    const queryParams = search ? { search } : undefined;
    const url = new URL(`${envData.API_BANNER_URL}career`);

    if (queryParams) {
      url.search = new URLSearchParams(queryParams).toString();
    }

    const careers = this.httpService
      .get(url.toString())
      .toPromise()
      .then((response) => response.data);

    return this.convertToDictinoary(await careers);
  }

  async findOneByid(id: number) {
    const career = await this.httpService
      .get(`${envData.API_BANNER_URL}career` + '/' + id)
      .toPromise()
      .then((response) => response.data);

    return this.slugToName(career.name);
  }

  private convertToDictinoary(career: CareerI[]): Record<string, string> {
    const dictionary: Record<string, string> = {};
    career.forEach((c) => {
      dictionary[c.name] = this.slugToName(c.name);
    });
    return dictionary;
  }
  // input ingenieria-iunformatica --> ouput: Ingenieria informatica
  private slugToName(slug: string): string {
    const words = slug.split('-');
    const capitalizedWords = words.map((w) => w[0].toUpperCase() + w.slice(1));
    return capitalizedWords.join(' ');
  }
}
