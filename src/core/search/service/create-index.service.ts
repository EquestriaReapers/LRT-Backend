import { Injectable } from '@nestjs/common';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';

@Injectable()
export class IndexService {
  constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,
  ) {}

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
}
