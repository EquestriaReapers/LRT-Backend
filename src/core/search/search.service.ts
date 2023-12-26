import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from '../profiles/entities/profile.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { SearchProfileDto } from './dto/search.profiles.dto';
import { Career } from '../career/enum/career.enum';

@Injectable()
export class SearchService {
  public constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  public async getProfiles() {
    const profiles = await this.profileRepository.find({
      relations: ['user', 'experience', 'skills'],
      select: {
        user: {
          name: true,
          lastname: true,
          email: true,
        },
      },
      where: {
        deletedAt: null,
      },
    });

    return profiles;
  }

  async createIndex() {
    const checkIndex = await this.searchClient.indices.exists({
      index: 'profiles',
    });

    if (checkIndex.statusCode === 404) {
      const index = await this.searchClient.indices.create({
        index: 'profiles',
        body: {
          settings: {
            analysis: {
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'autocomplete_filter'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'integer' },
              userId: { type: 'integer' },
              name: { type: 'text' },
              lastname: { type: 'text' },
              email: { type: 'text' },
              description: { type: 'text' },
              mainTitle: { type: 'text' },
              countryResidence: { type: 'text' },
              skills: {
                type: 'nested',
                properties: {
                  name: { type: 'text' },
                },
              },
              experience: {
                type: 'nested',
                properties: {
                  businessName: { type: 'text' },
                  role: { type: 'text' },
                  location: { type: 'text' },
                  description: { type: 'text' },
                },
              },
            },
          },
        },
      });
    }
  }

  async indexProfiles() {
    await this.createIndex();

    const body = await this.parseAndPrepareData();

    const resp = await this.searchClient.bulk({
      index: 'profiles',
      body,
    });

    return resp;
  }

  public async search(
    searchParam: SearchProfileDto,
    page: number,
    limit: number,
    random: number,
    career: string[],
    skills: string[],
    countryResidence: string[],
  ) {
    try {
      const from = (page - 1) * limit;

      let filters = [];

      if (!random) random = Math.floor(Math.random() * 1000);

      career = await this.validateCarrera(career);

      skills = await this.validateQueryArrayRelation(skills, 'skills');

      countryResidence = await this.validateQueryArrayCountry(countryResidence);

      if (career && Array.isArray(career)) {
        career.forEach((c) => {
          filters.push({
            match: {
              mainTitle: c,
            },
          });
        });
      }

      if (skills && Array.isArray(skills)) {
        skills.forEach((skill) => {
          filters.push({
            nested: {
              path: 'skills',
              query: {
                match: {
                  'skills.name': skill,
                },
              },
            },
          });
        });
      }

      if (countryResidence && Array.isArray(countryResidence)) {
        countryResidence.forEach((country) => {
          filters.push({
            match: {
              countryResidence: country,
            },
          });
        });
      }

      let should: any[] = [];

      if (
        searchParam &&
        searchParam.text &&
        searchParam.text.trim().length > 0
      ) {
        should.push(
          {
            multi_match: {
              query: searchParam.text,
              fields: [
                'name',
                'lastname',
                'email',
                'description',
                'mainTitle',
                'countryResidence',
              ],
              type: 'bool_prefix',
              operator: 'or',
            },
          },
          {
            nested: {
              path: 'skills',
              query: {
                bool: {
                  must: {
                    match: { 'skills.name': searchParam.text },
                  },
                  must_not: {
                    exists: {
                      field: 'skills.deletedAt',
                    },
                  },
                },
              },
            },
          },
          {
            nested: {
              path: 'experience',
              query: {
                bool: {
                  must: {
                    multi_match: {
                      query: searchParam.text,
                      fields: [
                        'experience.businessName',
                        'experience.role',
                        'experience.location',
                        'experience.description',
                      ],
                      type: 'bool_prefix',
                      operator: 'or',
                    },
                  },
                  must_not: {
                    exists: {
                      field: 'experience.deletedAt',
                    },
                  },
                },
              },
            },
          },
        );
      } else {
        should = [{ match_all: {} }];
      }

      let query: any = {
        bool: {
          should: should,
          filter: filters,
          must_not: {
            exists: {
              field: 'deletedAt',
            },
          },
        },
      };

      query = {
        function_score: {
          query,
          functions: [
            {
              random_score: { seed: random },
            },
          ],
        },
      };

      const { body } = await this.searchClient.search({
        index: 'profiles',
        body: {
          query,
          from,
          size: limit,
        },
      });

      const totalCount = body.hits.total.value;
      const hits = body.hits.hits;
      let data = hits.map((item: any) => item._source);
      data = await this.formatedData(data);

      return {
        pagination: {
          itemCount: body.length,
          totalItems: totalCount,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          randomSeed: random,
        },
        profiles: data,
      };
    } catch (err) {
      throw err;
    }
  }

  async parseAndPrepareData() {
    const profiles = await this.getProfiles();

    const body = profiles.flatMap((doc) => [
      { index: { _index: 'profiles', _id: doc.id } },
      {
        id: doc.id,
        userId: doc.userId,
        name: doc.user.name,
        lastname: doc.user.lastname,
        email: doc.user.email,
        description: doc.description,
        mainTitle: doc.mainTitle,
        countryResidence: doc.countryResidence,
        skills: doc.skills,
        experience: doc.experience,
      },
    ]);

    return body;
  }

  async deleteIndex() {
    const resp = await this.searchClient.indices.delete({
      index: 'profiles',
    });

    return resp;
  }

  private async validateQueryArrayRelation(
    relations: string[] | null,
    relationName: string,
  ) {
    if (relations) {
      relations = Array.isArray(relations) ? relations : [relations];

      const validationQuery = await this.profileRepository.find({
        relations: [relationName],
        where: {
          skills: {
            name: In(relations),
          },
        },
      });

      if (!validationQuery) {
        throw new BadRequestException(`Valor invaldo para ${relationName}`);
      }
    } else {
      relations = null;
    }

    return relations;
  }

  private async validateQueryArrayCountry(column: string[] | null) {
    if (column) {
      column = Array.isArray(column) ? column : [column];

      const validationQuery = await this.profileRepository.find({
        where: {
          countryResidence: In(column),
        },
      });

      if (!validationQuery) {
        throw new BadRequestException(`Valor invaldo para ${column}`);
      }
    } else {
      column = null;
    }

    return column;
  }

  private async validateCarrera(carrera: any) {
    if (carrera) {
      carrera = Array.isArray(carrera) ? carrera : [carrera];

      carrera = carrera.map((c: string) => {
        const carreraLower = c.toLowerCase() as Career;

        if (!Object.values(Career).includes(carreraLower)) {
          throw new BadRequestException(
            `Valor inválido para carrera: ${carreraLower}`,
          );
        }

        return carreraLower;
      });
    } else {
      carrera = null;
    }

    return carrera;
  }

  private async formatedData(data: any) {
    const respuestaNormal = data.map((item) => ({
      ...item,
      user: {
        id: item.id,
        name: item.name,
        lastname: item.lastname,
        email: item.email,
      },
    }));

    return respuestaNormal;
  }
}