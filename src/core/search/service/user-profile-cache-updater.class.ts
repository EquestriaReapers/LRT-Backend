import { Injectable } from '@nestjs/common';
import { Profile } from '../../profiles/entities/profile.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { IndexService } from './create-index.service';
import { UserProfilePresenter } from './user-profile-presenter.class';

@Injectable()
export class UserProfileCacheUpdater {
  public constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly indexService: IndexService,

    private readonly userProfilePresenter: UserProfilePresenter,
  ) {}

  private async getProfile(profileId: number) {
    const profile = await this.profileRepository.findOne({
      relations: [
        'user',
        'skillsProfile',
        'skillsProfile.skill',
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
        id: profileId,
      },
    });

    return this.userProfilePresenter.format(profile);
  }

  async updateOneProfile(profileId: number) {
    await this.indexService.createIndexProfile();

    const body = await this.parseAndPrepareDataForOneProfile(profileId);

    const resp = await this.searchClient.bulk({
      index: 'profiles',
      body,
    });

    return resp;
  }

  private async parseAndPrepareDataForOneProfile(profileId: number) {
    const profile = await this.getProfile(profileId);

    const body = [profile].flatMap((doc) => [
      { index: { _index: 'profiles', _id: doc.id } },
      {
        id: doc.id,
        userId: doc.userId,
        name: doc.user.name,
        lastname: doc.user.lastname,
        email: doc.user.email,
        description: doc.description,
        mainTitle: doc.mainTitle,
        mainTitleCode: doc.mainTitleCode,
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
}
