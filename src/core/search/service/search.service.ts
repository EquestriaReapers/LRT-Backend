import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from '../../profiles/entities/profile.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { SearchProfileDto } from '../dto/search.profiles.dto';
import { Career } from '../../career/enum/career.enum';
import { IndexService } from './create-index.service';

@Injectable()
export class SearchService {
  public constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly indexService: IndexService,
  ) {}

  public async getProfiles() {
    const profiles = await this.profileRepository.find({
      relations: [
        'user',
        'experience',
        'skillsProfile',
        'skillsProfile.skill',
        'portfolio',
      ],
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

    return this.UserProfilePresenter(profiles);
  }

  async indexProfiles() {
    await this.indexService.createIndex();

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

      let filter = [];

      if (!random) random = Math.floor(Math.random() * 1000);

      career = this.getValidatedCarreras(career);

      skills = await this.validateQueryArrayRelation(skills, 'skills');

      countryResidence = await this.validateQueryArrayCountry(countryResidence);

      if (career) {
        career.forEach((mainTitle) => {
          filter.push({
            match: {
              mainTitle,
            },
          });
        });
      }

      if (skills && Array.isArray(skills)) {
        skills.forEach((skill) => {
          filter.push({
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
        countryResidence.forEach((countryResidence) => {
          filter.push({
            match: {
              countryResidence,
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
          {
            nested: {
              path: 'portfolio',
              query: {
                bool: {
                  must: {
                    multi_match: {
                      query: searchParam.text,
                      fields: [
                        'portfolio.title',
                        'portfolio.description',
                        'portfolio.location',
                      ],
                      type: 'bool_prefix',
                      operator: 'or',
                    },
                  },
                  must_not: {
                    exists: {
                      field: 'portfolio.deletedAt',
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
          should,
          filter,
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
      data = this.formatedData(data);

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

  async deleteIndex() {
    return await this.indexService.deleteIndex();
  }

  private async parseAndPrepareData() {
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
        portfolio: doc.portfolio,
      },
    ]);

    return body;
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

  private getValidatedCarreras(_carrerasRaw: any) {
    if (_carrerasRaw) {
      const carrerasRaw = Array.isArray(_carrerasRaw)
        ? _carrerasRaw
        : [_carrerasRaw];
      return carrerasRaw.map((carreraRaw: string) => {
        const carreraLower = carreraRaw.toLowerCase() as Career;
        if (!Object.values(Career).includes(carreraLower)) {
          throw new BadRequestException(
            `Valor inválido para carrera: ${carreraLower}`,
          );
        }
        return carreraLower;
      });
    }
    return null;
  }

  private formatedData(data: any) {
    return data.map((item) => ({
      ...item,
      user: {
        id: item.id,
        name: item.name,
        lastname: item.lastname,
        email: item.email,
      },
    }));
  }

  private UserProfilePresenter(profiles: Profile[]) {
    return profiles.map((profile) => {
      const { skillsProfile, languageProfile, ...otherProfileProps } = profile;

      const mappedProfile = {
        ...otherProfileProps,
        languages: languageProfile
          ? languageProfile.map(({ language, ...lp }) => ({
              ...lp,
              name: language.name,
            }))
          : [],
        skills: skillsProfile
          ? skillsProfile.map(({ skill, ...sp }) => ({
              id: skill.id,
              name: skill.name,
              type: skill.type,
              skillProfileId: sp.id,
              isVisible: sp.isVisible,
            }))
          : [],
      };

      return mappedProfile;
    });
  }
}
