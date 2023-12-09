import { BadRequestException, Injectable } from '@nestjs/common';
import { Carrera, Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RANDOM_PROFILES_PAGINATE_QUERY,
  SET_SEED_QUERY,
} from './profiles.queries';
import {
  PaginationMessage,
  ResponsePaginationProfile,
} from '../dto/responses.dto';
import { FindAllPayload } from '../dto/find-all-payload.interface';

@Injectable()
export default class FindAllPaginateAction {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute({
    random,
    carrera,
    ...opt
  }: FindAllPayload): Promise<ResponsePaginationProfile> {
    const { page, limit, skip } = this.getPaginationData(opt);
    if (!random) random = Math.random();

    if (carrera) {
      if (!Array.isArray(carrera)) {
        carrera = [carrera];
      }

      carrera = carrera.map((c) => {
        const carreraUpper = c.toUpperCase() as Carrera;

        if (!Object.values(Carrera).includes(carreraUpper)) {
          throw new BadRequestException(
            `Invalid value for Carrera: ${carreraUpper}`,
          );
        }

        return carreraUpper;
      });
    } else {
      carrera = null;
    }

    const profiles = await this.executeQueryGetRandomProfiles(
      random,
      limit,
      skip,
      carrera,
    );
    const totalCount = await this.profileRepository.count();

    const pagination: PaginationMessage = {
      itemCount: profiles.length,
      totalItems: totalCount,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      randomSeed: random,
    };

    return { profiles, pagination };
  }

  private async setProfileRepositorySeed(randomSeed: number): Promise<void> {
    await this.profileRepository.query(
      SET_SEED_QUERY.replace('{{randomSeed}}', randomSeed + ''),
    );
  }

  private async executeQueryGetRandomProfiles(
    random: number,
    limit: number,
    skip: number,
    carrera: Carrera[],
  ): Promise<Profile[]> {
    await this.setProfileRepositorySeed(random);

    let query = RANDOM_PROFILES_PAGINATE_QUERY.replace(
      '{{limit}}',
      limit + '',
    ).replace('{{skip}}', skip + '');

    if (carrera) {
      query = this.addMultipleFiltersToQuery(query, 'career', carrera);
    }

    const resultsRaw = await this.profileRepository.query(query);

    const formattedResult: Profile[] = resultsRaw.map((row) => ({
      id: row.profile_id,
      userId: row.profile_userId,
      user: {
        id: row.user_id,
        name: row.user_name,
        lastname: row.user_lastname,
        email: row.user_email,
      },
      description: row.profile_description,
      mainTitle: row.profile_mainTitle,
      career: row.profile_career,
      countryResidence: row.profile_countryResidence,
      experience: row.experiences.map(JSON.parse),
      skills: row.skills.map(JSON.parse),
      languageProfile: row.languageProfile.map(JSON.parse),
      deletedAt: row.profile_deletedAt,
    }));

    return formattedResult;
  }

  private getPaginationData(opt: {
    page?: number | null;
    limit?: number | null;
  }): {
    page: number;
    skip: number;
    limit: number;
  } {
    const page = opt.page || 1;
    const limit = opt.limit || 10;
    return {
      page: opt.page || 1,
      limit: opt.limit || 10,
      skip: (page - 1) * limit,
    };
  }

  private addFilterToQuery(
    query: string,
    columnName: string,
    filterValue: any,
  ): string {
    if (filterValue) {
      const filterCondition = `"profile"."${columnName}" = '${filterValue}'`;
      const whereIndex = query.lastIndexOf('WHERE');

      if (whereIndex !== -1) {
        // Si ya hay una cláusula WHERE en la consulta, agrega la condición de filtro con un operador lógico AND
        query =
          query.slice(0, whereIndex + 5) +
          ` ${filterCondition} AND` +
          query.slice(whereIndex + 5);
      } else {
        // Si no hay una cláusula WHERE, agrega la condición de filtro al final de la consulta
        query += ` WHERE ${filterCondition}`;
      }
    }

    return query;
  }

  private addMultipleFiltersToQuery(
    query: string,
    columnName: string,
    filterValues: any[],
  ): string {
    if (filterValues.length > 0) {
      const filterConditions = filterValues.map(
        (value) => `"${columnName}" = '${value}'`,
      );
      const filterQuery = filterConditions.join(' OR ');

      const whereIndex = query.lastIndexOf('WHERE');
      if (whereIndex !== -1) {
        query =
          query.slice(0, whereIndex + 5) +
          filterQuery +
          ' AND ' +
          query.slice(whereIndex + 5);
      } else {
        query += ' WHERE ' + filterQuery;
      }
    }

    return query;
  }
}
