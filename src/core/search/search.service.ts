import { Injectable } from '@nestjs/common';
import { InjectMeiliSearch } from 'nestjs-meilisearch';
import { MeiliSearch, Index, SearchParams } from 'meilisearch';
import { Profile } from '../profiles/entities/profile.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SearchService {
  public constructor(
    @InjectMeiliSearch() private readonly meiliSearch: MeiliSearch,

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

  private getProfilesIndex(): Index {
    return this.meiliSearch.index('profiles');
  }

  public async addDocuments(documents: any[]) {
    const index = this.getProfilesIndex();
    return await index.addDocuments(documents);
  }

  public async search(text: string, searchParams?: SearchParams) {
    const index = this.getProfilesIndex();
    return await index.search(text, searchParams);
  }

  public async deleteAllDocuments() {
    const index = this.getProfilesIndex();
    return await index.deleteAllDocuments();
  }
}
