import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { envData } from 'src/config/datasource';

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

    return careers;
  }

  async findOneByid(id: number) {
    const career = await this.httpService
      .get(`${envData.API_BANNER_URL}career` + '/' + id)
      .toPromise()
      .then((response) => response.data);

    return career;
  }
}
