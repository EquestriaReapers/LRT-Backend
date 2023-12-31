import { Injectable } from '@nestjs/common';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { map } from 'rxjs';

@Injectable()
export class IndexService {
  constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,
  ) {}

  async createIndexProfile() {
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
                  type: { type: 'text' },
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
              portfolio: {
                type: 'nested',
                properties: {
                  title: { type: 'text' },
                  description: { type: 'text' },
                  location: { type: 'text' },
                },
              },
              education: {
                type: 'nested',
                properties: {
                  title: { type: 'text' },
                  entity: { type: 'text' },
                },
              },
            },
          },
        },
      });
    }
  }

  async createIndexPortfolio() {
    const checkIndex = await this.searchClient.indices.exists({
      index: 'portfolio',
    });

    if (checkIndex.statusCode === 404) {
      const index = await this.searchClient.indices.create({
        index: 'portfolio',
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
              profileId: { type: 'integer' },
              title: { type: 'text' },
              description: { type: 'text' },
              location: { type: 'text' },
              dateEnd: { type: 'date' },
              profile: {
                type: 'nested',
                properties: {
                  name: { type: 'text' },
                  lastname: { type: 'text' },
                  mainTitle: { type: 'text' },
                },
              },
            },
          },
        },
      });
    }
  }

  async deleteIndex() {
    const resp = await this.searchClient.indices.delete({
      index: 'profiles',
    });

    return resp;
  }

  async deleteIndexPortfolio() {
    const resp = await this.searchClient.indices.delete({
      index: 'portfolio',
    });

    return resp;
  }
}
