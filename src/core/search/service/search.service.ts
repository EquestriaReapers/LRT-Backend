import { BadRequestException, Injectable } from '@nestjs/common';
import { Profile } from '../../profiles/entities/profile.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { SearchProfileDto } from '../dto/search.profiles.dto';
import { IndexService } from './create-index.service';
import { Portfolio } from 'src/core/portfolio/entities/portfolio.entity';
import { HttpService } from '@nestjs/axios';
import { envData } from 'src/config/datasource';
import { Language } from 'src/core/language/entities/language.entity';
import { UserProfilePresenter } from './user-profile-presenter.class';

@Injectable()
export class SearchService {
  public constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,

    private readonly indexService: IndexService,

    private readonly httpService: HttpService,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,

    private readonly userProfilePresenter: UserProfilePresenter,
  ) {}

  public async getProfiles() {
    const profiles = await this.profileRepository.find({
      relations: [
        'user',
        'skillsProfile',
        'skillsProfile.skill',
        'education',
        'experience',
        'portfolio',
        'education',
        'languageProfile',
        'languageProfile.language',
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

    return this.presentProfiles(profiles);
  }

  public async getPortfolio() {
    const portfolio = await this.portfolioRepository.find({
      relations: ['profile', 'profile.user'],
      where: {
        deletedAt: null,
      },
    });

    return portfolio;
  }

  async indexProfiles() {
    await this.indexService.createIndexProfile();

    const body = await this.parseAndPrepareData();

    const resp = await this.searchClient.bulk({
      index: 'profiles',
      body,
    });

    return resp;
  }

  async indexPortfolio() {
    await this.indexService.createIndexPortfolio();

    const body = await this.parseAndPreparePortfolioData();

    const resp = await this.searchClient.bulk({
      index: 'portfolio',
      body,
    });

    return resp;
  }

  public async search(
    searchParam: SearchProfileDto,
    page: number,
    limit: number,
    random: number,
    isExclusiveSkills: boolean,
    isExclusiveLanguages: boolean,
  ) {
    try {
      const from = (page - 1) * limit;

      const filter = [];

      const must = [];

      let { career, skills, countryResidence, language } = searchParam;

      if (!random) random = Math.floor(Math.random() * 1000);

      career = await this.getValidatedCarreras(career);

      skills = await this.validateQueryArrayRelation(skills, 'skills');

      countryResidence = await this.validateQueryArrayCountry(countryResidence);

      language = await this.validateQueryArray(language);

      if (career && career.length > 0) {
        filter.push({
          bool: {
            should: career.map((career) => ({
              term: {
                mainTitleCode: career,
              },
            })),
          },
        });
      }

      if (skills && Array.isArray(skills) && skills.length > 0) {
        if (isExclusiveSkills) {
          skills.forEach((skill) => {
            filter.push({
              nested: {
                path: 'skills',
                query: {
                  term: {
                    'skills.nameCode': skill,
                  },
                },
              },
            });
          });
        } else {
          const shouldClauses = skills.map((skill) => ({
            term: {
              'skills.nameCode': skill,
            },
          }));

          filter.push({
            nested: {
              path: 'skills',
              query: {
                bool: {
                  should: shouldClauses,
                },
              },
            },
          });
        }
      }

      if (
        countryResidence &&
        Array.isArray(countryResidence) &&
        countryResidence.length > 0
      ) {
        filter.push({
          bool: {
            should: countryResidence.map((countryResidence) => ({
              match: {
                countryResidence,
              },
            })),
          },
        });
      }

      if (language && Array.isArray(language) && language.length > 0) {
        if (isExclusiveLanguages) {
          language.forEach((language) => {
            filter.push({
              nested: {
                path: 'language',
                query: {
                  term: {
                    'language.nameCode': language,
                  },
                },
              },
            });
          });
        } else {
          const shouldClauses = language.map((language) => ({
            term: {
              'language.nameCode': language,
            },
          }));

          filter.push({
            nested: {
              path: 'language',
              query: {
                bool: {
                  should: shouldClauses,
                },
              },
            },
          });
        }
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
            match: {
              name: {
                query: searchParam.text,
                fuzziness: 2,
              },
            },
          },
          {
            match: {
              lastname: {
                query: searchParam.text,
                fuzziness: 2,
              },
            },
          },
          {
            match: {
              email: {
                query: searchParam.text,
                fuzziness: 2,
              },
            },
          },
          {
            match: {
              description: {
                query: searchParam.text,
                fuzziness: 2,
              },
            },
          },
          {
            match: {
              mainTitle: {
                query: searchParam.text,
                fuzziness: 2,
              },
            },
          },
          {
            match: {
              countryResidence: {
                query: searchParam.text,
                fuzziness: 2,
              },
            },
          },
          {
            nested: {
              path: 'skills',
              query: {
                bool: {
                  must: {
                    match: {
                      'skills.name': {
                        query: searchParam.text,
                        fuzziness: 2,
                      },
                    },
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
                  should: [
                    {
                      match: {
                        'experience.businessName': {
                          query: searchParam.text,
                          fuzziness: 2,
                          operator: 'or',
                        },
                      },
                    },
                    {
                      match: {
                        'experience.role': {
                          query: searchParam.text,
                          fuzziness: 2,
                          operator: 'or',
                        },
                      },
                    },
                    {
                      match: {
                        'experience.location': {
                          query: searchParam.text,
                          fuzziness: 2,
                          operator: 'or',
                        },
                      },
                    },
                    {
                      match: {
                        'experience.description': {
                          query: searchParam.text,
                          fuzziness: 2,
                          operator: 'or',
                        },
                      },
                    },
                  ],
                  must_not: {
                    exists: {
                      field: 'experience.deletedAt',
                    },
                  },
                  minimum_should_match: 1,
                },
              },
            },
          },
          {
            nested: {
              path: 'education',
              query: {
                bool: {
                  should: [
                    {
                      match: {
                        'education.title': {
                          query: searchParam.text,
                          fuzziness: 2,
                          operator: 'or',
                        },
                      },
                    },
                    {
                      match: {
                        'education.entity': {
                          query: searchParam.text,
                          fuzziness: 2,
                          operator: 'or',
                        },
                      },
                    },
                  ],
                  must_not: {
                    exists: {
                      field: 'education.deletedAt',
                    },
                  },
                  minimum_should_match: 1,
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

  async searchPortfolio(
    searchParam: SearchProfileDto,
    page: number,
    limit: number,
    random: number,
  ) {
    try {
      let should: any[] = [];
      const from = (page - 1) * limit;
      if (!random) random = Math.floor(Math.random() * 1000);

      if (
        searchParam &&
        searchParam.text &&
        searchParam.text.trim().length > 0
      ) {
        should.push(
          {
            multi_match: {
              query: searchParam.text,
              fields: ['title', 'description', 'location'],
              type: 'bool_prefix',
              operator: 'or',
            },
          },
          {
            nested: {
              path: 'profile',
              query: {
                bool: {
                  must: {
                    multi_match: {
                      query: searchParam.text,
                      fields: [
                        'profile.name',
                        'profile.lastname',
                        'profile.mainTitle',
                      ],
                      type: 'bool_prefix',
                      operator: 'or',
                    },
                  },
                  must_not: {
                    exists: {
                      field: 'profile.deletedAt',
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
        index: 'portfolio',
        body: {
          query,
          from,
          size: limit,
        },
      });

      const totalCount = body.hits.total.value;
      const hits = body.hits.hits;
      const data = hits.map((item: any) => item._source);

      return {
        pagination: {
          itemCount: body.length,
          totalItems: totalCount,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          randomSeed: random,
        },
        portfolios: data,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteIndex() {
    return await this.indexService.deleteIndex();
  }

  async deleteIndexPortfolio() {
    return await this.indexService.deleteIndexPortfolio();
  }

  private async validateQueryArray(column: string[] | null) {
    if (column) {
      column = Array.isArray(column) ? column : [column];

      const validationQuery = await this.languageRepository.find({
        where: {
          name: In(column),
        },
      });

      if (!validationQuery) {
        throw new BadRequestException(`Valor invaldo para ${column}`);
      }

      column = this.slugifyArray(column);
    } else {
      column = null;
    }

    return column;
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
        mainTitleCode: this.slugify(doc.mainTitle),
        countryResidence: doc.countryResidence,
        website: doc.website,
        skills: doc.skills,
        experience: doc.experience,
        portfolio: doc.portfolio,
        education: doc.education,
        language: doc.languages,
      },
    ]);

    return body;
  }

  private async parseAndPreparePortfolioData() {
    const portfolios = await this.getPortfolio();

    const body = portfolios.flatMap((doc) => [
      { index: { _index: 'portfolio', _id: doc.id } },
      {
        id: doc.id,
        title: doc.title,
        profileId: doc.profile.id,
        description: doc.description,
        location: doc.location,
        imagePrincipal: doc.imagePrincipal,
        image: doc.image,
        url: doc.url,
        dateEnd: doc.dateEnd,
        profile: {
          name: doc.profile.user.name,
          lastname: doc.profile.user.lastname,
          mainTitle: doc.profile.mainTitle,
        },
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

      relations = this.slugifyArray(relations);
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

  private async getValidatedCarreras(_carrerasRaw: any) {
    if (_carrerasRaw) {
      const carrerasRaw = Array.isArray(_carrerasRaw)
        ? _carrerasRaw
        : [_carrerasRaw];
      return carrerasRaw.map((carreraRaw: string) => {
        const carreraLower = carreraRaw.toLowerCase();
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

  private presentProfiles(profiles: Profile[]) {
    return profiles.map((profile) => this.userProfilePresenter.format(profile));
  }

  private slugify(text: string | null) {
    if (text) {
      return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .trim();
    }
    return null;
  }

  private slugifyArray(strings: string[]): string[] {
    return strings.map((text) =>
      text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .trim(),
    );
  }
}
