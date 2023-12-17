import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  RANDOM_PROFILES_PAGINATE_QUERY,
  SET_SEED_QUERY,
} from './profiles.queries';
import {
  PaginationMessage,
  ResponsePaginationProfile,
} from '../dto/responses.dto';
import { FindAllPayload } from '../dto/find-all-payload.interface';
import { Career } from 'src/core/career/enum/career.enum';

@Injectable()
export default class FindAllPaginateAction {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute({
    random,
    carrera,
    skills,
    ...opt
  }: FindAllPayload): Promise<ResponsePaginationProfile> {
    const { page, limit, skip } = this.getPaginationData(opt);
    if (!random) random = Math.random();

    if (carrera) {
      if (!Array.isArray(carrera)) {
        carrera = [carrera];
      }

      carrera = carrera.map((c) => {
        const carreraUpper = c.toUpperCase() as Career;

        if (!Object.values(Career).includes(carreraUpper)) {
          throw new BadRequestException(
            `Invalid value for Carrera: ${carreraUpper}`,
          );
        }

        return carreraUpper;
      });
    } else {
      carrera = null;
    }

    if (skills) {
      if (!Array.isArray(skills)) {
        skills = [skills];
      }

      const validationSkill = await this.profileRepository.find({
        relations: ['skills'],
        where: {
          skills: {
            name: In(skills),
          },
        },
      });

      if (!validationSkill) {
        throw new BadRequestException(`Valor invaldo para skill`);
      }
    } else {
      skills = null;
    }

    const profiles = await this.executeQueryGetRandomProfiles(
      random,
      limit,
      skip,
      carrera,
      skills,
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
    carrera: Career[],
    skills: string[],
  ): Promise<Profile[]> {
    await this.setProfileRepositorySeed(random);

    let query = RANDOM_PROFILES_PAGINATE_QUERY.replace(
      '{{limit}}',
      limit + '',
    ).replace('{{skip}}', skip + '');

    if (carrera) {
      query = this.addMultipleFiltersToQuery(
        query,
        'profile',
        'mainTitle',
        carrera,
      );
    }

    if (skills) {
      query = this.addMultipleFiltersToQuery(query, 'skills', 'name', skills);
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
      countryResidence: row.profile_countryResidence,
      experience: row.experiences.map(JSON.parse),
      skills: row.skills.map(JSON.parse),
      languages: row.languageProfile.map(JSON.parse),
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
    tableName: string,
    columnName: string,
    filterValues: any[],
  ): string {
    if (filterValues.length > 0) {
      const filterConditions = filterValues.map(
        (value) => `"${tableName}"."${columnName}" = '${value}'`,
      );
      const filterQuery = filterConditions.join(' OR ');

      // Si se está filtrando por habilidades, modificar la consulta principal
      if (tableName === 'skills') {
        const subqueryFilter = `EXISTS (
          SELECT 1 FROM "profile_skills_skill" "profile_skills"
          JOIN "skill" "skills" ON "skills"."id"="profile_skills"."skillId"
          WHERE "profile_skills"."profileId" = "profile"."id" AND (${filterQuery})
        )`;

        const whereIndex = query.lastIndexOf('WHERE');
        if (whereIndex !== -1) {
          query =
            query.slice(0, whereIndex + 6) +
            subqueryFilter +
            ' AND ' +
            query.slice(whereIndex + 6);
        } else {
          query += ' WHERE ' + subqueryFilter;
        }
      } else {
        // Si no se está filtrando por habilidades, agregar el filtro a la cláusula WHERE principal
        const whereIndex = query.lastIndexOf('WHERE');
        if (whereIndex !== -1) {
          query =
            query.slice(0, whereIndex + 6) +
            filterQuery +
            ' AND ' +
            query.slice(whereIndex + 6);
        } else {
          query += ' WHERE ' + filterQuery;
        }
      }
    }

    return query;
  }
}
