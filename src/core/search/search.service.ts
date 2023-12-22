import { Injectable } from '@nestjs/common';
import { Profile } from '../profiles/entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { SearchProfile } from '@opensearch-project/opensearch/api/types';
import { SearchProfileDto } from './dto/search.profiles.dto';

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
  ) {
    try {
      const from = (page - 1) * limit;

      if (!random) random = Math.floor(Math.random() * 1000);

      let query: any = {
        bool: {
          should: [
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
                  match: { 'skills.name': searchParam.text },
                },
              },
            },
            {
              nested: {
                path: 'experience',
                query: {
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
              },
            },
          ],
          filter: [
            {
              term: {
                'experience.deletedAt': null,
              },
            },
            {
              term: {
                'skills.deletedAt': null,
              },
            },
            {
              term: {
                deletedAt: null,
              },
            },
          ],
        },
      };

      if (!searchParam.text) {
        query = { match_all: {} };
      }

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
        data,
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
}
