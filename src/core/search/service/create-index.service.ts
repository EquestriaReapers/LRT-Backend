import { Injectable } from '@nestjs/common';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { env } from 'process';
import { map } from 'rxjs';
import { envData } from 'src/config/datasource';

@Injectable()
export class IndexService {
  constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,
  ) {}

  async createIndexProfile() {
    const checkIndex = await this.searchClient.indices.exists({
      index: envData.INDEX_PROFILE,
    });

    if (checkIndex.statusCode === 404) {
      const index = await this.searchClient.indices.create({
        index: envData.INDEX_PROFILE,
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
                standard_lowercase: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'integer' },
              userId: { type: 'integer' },
              name: { type: 'text', analyzer: 'standard_lowercase' },
              lastname: { type: 'text', analyzer: 'standard_lowercase' },
              email: { type: 'text', analyzer: 'standard_lowercase' },
              description: { type: 'text', analyzer: 'standard_lowercase' },
              mainTitle: { type: 'text', analyzer: 'standard_lowercase' },
              mainTitleCode: { type: 'keyword' },
              countryResidence: {
                type: 'text',
                analyzer: 'standard_lowercase',
              },
              skills: {
                type: 'nested',
                properties: {
                  name: { type: 'text', analyzer: 'standard_lowercase' },
                  nameCode: { type: 'keyword' },
                  type: { type: 'text', analyzer: 'standard_lowercase' },
                },
              },
              experience: {
                type: 'nested',
                properties: {
                  businessName: {
                    type: 'text',
                    analyzer: 'standard_lowercase',
                  },
                  role: { type: 'text', analyzer: 'standard_lowercase' },
                  location: { type: 'text', analyzer: 'standard_lowercase' },
                  description: { type: 'text', analyzer: 'standard_lowercase' },
                },
              },
              portfolio: {
                type: 'nested',
                properties: {
                  title: { type: 'text', analyzer: 'standard_lowercase' },
                  description: { type: 'text', analyzer: 'standard_lowercase' },
                  location: { type: 'text', analyzer: 'standard_lowercase' },
                },
              },
              education: {
                type: 'nested',
                properties: {
                  title: { type: 'text', analyzer: 'standard_lowercase' },
                  entity: { type: 'text', analyzer: 'standard_lowercase' },
                },
              },
              language: {
                type: 'nested',
                properties: {
                  name: { type: 'text', analyzer: 'standard_lowercase' },
                  nameCode: { type: 'keyword' },
                  level: { type: 'text', analyzer: 'standard_lowercase' },
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
      index: envData.INDEX_PORTFOLIO,
    });

    if (checkIndex.statusCode === 404) {
      const index = await this.searchClient.indices.create({
        index: envData.INDEX_PORTFOLIO,
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
              imagePrincipal: { type: 'text' },
              image: { type: 'text' },
              url: { type: 'text' },
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
      index: envData.INDEX_PROFILE,
    });

    return resp;
  }

  async deleteIndexPortfolio() {
    const resp = await this.searchClient.indices.delete({
      index: envData.INDEX_PORTFOLIO,
    });

    return resp;
  }
}
