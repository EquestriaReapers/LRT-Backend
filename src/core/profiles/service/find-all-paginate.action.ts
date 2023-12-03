import { Injectable } from '@nestjs/common';
import { Profile } from '../entities/profile.entity';
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
    ...opt
  }: FindAllPayload): Promise<ResponsePaginationProfile> {
    const { page, limit, skip } = this.getPaginationData(opt);
    if (!random) random = Math.random();

    const profiles = await this.executeQueryGetRandomProfiles(
      random,
      limit,
      skip,
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
  ): Promise<Profile[]> {
    await this.setProfileRepositorySeed(random);

    const resultsRaw = await this.profileRepository.query(
      RANDOM_PROFILES_PAGINATE_QUERY.replace('{{limit}}', limit + '').replace(
        '{{skip}}',
        skip + '',
      ),
    );

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
}
