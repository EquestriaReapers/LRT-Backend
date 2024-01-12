import { Injectable } from '@nestjs/common';
import { Profile } from '../../profiles/entities/profile.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';
import { IndexService } from './create-index.service';
import { UserProfilePresenter } from './user-profile-presenter.class';
import { envData } from 'src/config/datasource';
import { Portfolio } from 'src/core/portfolio/entities/portfolio.entity';

@Injectable()
export class UserProfileCacheUpdater {
  public constructor(
    @InjectOpensearchClient()
    private readonly searchClient: OpensearchClient,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly indexService: IndexService,

    private readonly userProfilePresenter: UserProfilePresenter,

    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
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

  private async getPortfolio(profileId: number) {
    const portfolios = await this.portfolioRepository.findOne({
      relations: ['profile', 'profile.user'],
      where: {
        deletedAt: null,
        profileId,
      },
    });

    return portfolios;
  }

  async updateOneProfile(profileId: number) {
    await this.indexService.createIndexProfile();

    const body = await this.parseAndPrepareDataForOneProfile(profileId);

    const resp = await this.searchClient.bulk({
      index: envData.INDEX_PROFILE,
      body,
    });

    return resp;
  }

  async updatePortfolioOneProfile(profileId: number) {
    await this.indexService.createIndexPortfolio();

    const body = await this.parseAndPreparePortfolioDataOneProfile(profileId);

    const resp = await this.searchClient.bulk({
      index: envData.INDEX_PORTFOLIO,
      body,
    });

    return resp;
  }

  private async parseAndPrepareDataForOneProfile(profileId: number) {
    const profile = await this.getProfile(profileId);

    const body = [profile].flatMap((doc) => [
      { index: { _index: envData.INDEX_PROFILE, _id: doc.id } },
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

  private async parseAndPreparePortfolioDataOneProfile(profileId: number) {
    const portfolios = await this.getPortfolio(profileId);

    const body = [portfolios].flatMap((doc) => [
      { index: { _index: envData.INDEX_PORTFOLIO, _id: doc.id } },
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
}
