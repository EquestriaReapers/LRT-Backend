import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { envData } from 'src/config/datasource';
import { LocationResponse } from '../dto/response.dto';

@Injectable()
export class LocationService {
  constructor(private readonly httpService: HttpService) {}

  async findAll(name?: string): Promise<LocationResponse> {
    const headers = {
      'X-CSCAPI-KEY': envData.API_COUNTRY_KEY,
    };
    const requestOptions = {
      headers: headers,
    };

    const response = await this.httpService
      .get('https://api.countrystatecity.in/v1/countries', requestOptions)
      .toPromise();

    let countries = response.data;

    if (name && name.length > 0) {
      countries = countries.filter((country) =>
        country.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    return countries;
  }

  async findOne(id: number) {
    const headers = {
      'X-CSCAPI-KEY': envData.API_COUNTRY_KEY,
    };
    const requestOptions = {
      headers: headers,
    };

    const response = await this.httpService
      .get('https://api.countrystatecity.in/v1/countries', requestOptions)
      .toPromise();

    let country = response.data;

    if (id) {
      country = country.filter(
        (countrys) => countrys.id.toString() === id.toString(),
      );
    }

    return country;
  }
}
