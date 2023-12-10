import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from 'src/core/language/entities/language.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageProfile } from '../entities/language-profile.entity';
import { Profile } from '../entities/profile.entity';
import { AddLanguageProfileDto } from '../dto/add-language-profile.dto';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import {
  ERROR_EXIST_LANGUAGE_IN_PROFILE,
  ERROR_NOT_FOUND_LANGUAGE_IN_PROFILE,
  ERROR_PROFILE_LANGUAGUE_NOT_FOUND,
  PROFILE_NOT_FOUND,
} from '../messages';

@Injectable()
export default class LanguagueProfileService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,

    @InjectRepository(LanguageProfile)
    private readonly languageProfileRepository: Repository<LanguageProfile>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async add(
    addLanguageProfile: AddLanguageProfileDto,
    user: UserActiveInterface,
  ) {
    const { languageId, level } = addLanguageProfile;
    const profile = await this.profileRepository.findOne({
      where: { userId: user.id },
    });
    const language = await this.languageRepository.findOne({
      where: { id: languageId },
    });

    if (!profile || !language) {
      throw new NotFoundException(ERROR_PROFILE_LANGUAGUE_NOT_FOUND);
    }

    const existLanguage = await this.languageProfileRepository.findOne({
      where: { languageId: languageId, profileId: profile.id },
    });

    if (existLanguage) {
      throw new NotFoundException(ERROR_EXIST_LANGUAGE_IN_PROFILE);
    }

    return await this.languageProfileRepository.save({
      languageId: languageId,
      profileId: profile.id,
      level: level,
    });
  }

  async remove(languageId: number, user: UserActiveInterface): Promise<void> {
    const profile = await this.profileRepository.findOne({
      relations: ['languages'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const language = await this.languageRepository.findOne({
      where: { id: languageId },
    });

    if (!language) {
      throw new NotFoundException(ERROR_PROFILE_LANGUAGUE_NOT_FOUND);
    }

    const existLanguagueProfile = await this.languageProfileRepository.findOne({
      where: { languageId: languageId, profileId: profile.id },
    });

    if (!existLanguagueProfile) {
      throw new NotFoundException(ERROR_NOT_FOUND_LANGUAGE_IN_PROFILE);
    }

    await this.profileRepository.save(profile);
    return;
  }
}
