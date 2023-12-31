import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { Skill } from '../../skills/entities/skill.entity';
import { User } from '../../users/entities/user.entity';
import {
  ERROR_LIMITE_METHOD_CONTACT,
  ERROR_PROFILE_SKILL_NOT_FOUND,
  PROFILE_NOT_FOUND,
} from '../messages';
import { USER_NOT_FOUND } from 'src/core/users/messages';
import { SKILL_NOT_FOUND } from 'src/core/skills/messages';
import FindAllPaginateAction from './find-all-paginate.action';
import { ResponsePaginationProfile } from '../dto/responses.dto';
import { FindAllPayload } from '../dto/find-all-payload.interface';
import ExportPDFAction from './export-pdf';
import { Buffer } from 'buffer';
import { ContactMethod } from '../entities/contact-method.entity';
import { CreateContactDto } from '../dto/createContact.dto';
import { SkillsProfile } from '../entities/skills-profile.entity';
import { LanguageProfile } from '../entities/language-profile.entity';
import { ERROR_LANGUAGE_NOT_FOUND } from 'src/core/language/messages';
import { UpdateIsVisibleDto } from '../dto/isVisible.dto';

@Injectable()
export default class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(SkillsProfile)
    private skillsProfileRepository: Repository<SkillsProfile>,

    @InjectRepository(LanguageProfile)
    private languageProfileRepository: Repository<LanguageProfile>,

    private readonly findAllPaginateAction: FindAllPaginateAction,
    private readonly exportPdfAction: ExportPDFAction,
  ) {}

  async findAllPaginate(
    opt: FindAllPayload,
  ): Promise<ResponsePaginationProfile> {
    return await this.findAllPaginateAction.execute(opt);
  }

  async exportPdf(id: number): Promise<Buffer> {
    return await this.exportPdfAction.execute(id);
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId: id },
      relations: [
        'user',
        'skillsProfile',
        'skillsProfile.skill',
        'experience',
        'education',
        'portfolio',
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
      order: {
        id: 'DESC',
        experience: {
          id: 'DESC',
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const result = this.UserProfilePresenter(profile);
    return result;
  }

  async updateMyProfile(
    updateProfileDto: UpdateProfileDto,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.update(user.id, {
      description: updateProfileDto.description,
      mainTitle: updateProfileDto.mainTitle,
      countryResidence: updateProfileDto.countryResidence,
      website: updateProfileDto.website,
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    if (updateProfileDto.name === undefined || updateProfileDto.name === null) {
      const dataUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      updateProfileDto.name = dataUser.name;
    }

    if (
      updateProfileDto.lastname === undefined ||
      updateProfileDto.lastname === null
    ) {
      const dataUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      updateProfileDto.lastname = dataUser.lastname;
    }

    if (updateProfileDto.name || updateProfileDto.lastname) {
      const userUpdateResult = await this.userRepository.update(user.id, {
        name: updateProfileDto.name,
        lastname: updateProfileDto.lastname,
      });

      if (userUpdateResult.affected === 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
    }

    return;
  }

  async addSkillProfile(skillId: number, user: UserActiveInterface) {
    const profile = await this.profileRepository.findOne({
      relations: ['skillsProfile'],
      where: { userId: user.id },
    });
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });

    if (!profile || !skill) {
      throw new NotFoundException(ERROR_PROFILE_SKILL_NOT_FOUND);
    }

    const skillProfile = new SkillsProfile();
    skillProfile.skillId = skillId;
    skillProfile.profileId = user.id;
    skillProfile.isVisible = true;

    profile.skillsProfile.push(skillProfile);

    return await this.skillsProfileRepository.save(skillProfile);
  }

  async removeSkillProfile(
    skillId: number,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne({
      relations: ['skillsProfile'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const skillProfile = profile.skillsProfile.find(
      (skillProfile) => skillProfile.skillId === skillId,
    );

    if (!skillProfile) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    await this.skillsProfileRepository.remove(skillProfile);
    return;
  }

  async update(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    const profile = await this.profileRepository.update(userId, {
      description: updateProfileDto.description,
      mainTitle: updateProfileDto.mainTitle,
      countryResidence: updateProfileDto.countryResidence,
      website: updateProfileDto.website,
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    if (updateProfileDto.name === undefined || updateProfileDto.name === null) {
      const dataUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      updateProfileDto.name = dataUser.name;
    }

    if (
      updateProfileDto.lastname === undefined ||
      updateProfileDto.lastname === null
    ) {
      const dataUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      updateProfileDto.lastname = dataUser.lastname;
    }

    if (updateProfileDto.name || updateProfileDto.lastname) {
      const userUpdateResult = await this.userRepository.update(userId, {
        name: updateProfileDto.name,
        lastname: updateProfileDto.lastname,
      });

      if (userUpdateResult.affected === 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
    }

    return;
  }

  async remove(id: number) {
    const profile = await this.profileRepository.softDelete(id);

    if (!profile) throw new NotFoundException(PROFILE_NOT_FOUND);

    return profile;
  }

  async addContactMethod(
    user: UserActiveInterface,
    createContactMethodDto: CreateContactDto,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    if (profile.contactMethods.length >= 3) {
      throw new BadRequestException(ERROR_LIMITE_METHOD_CONTACT);
    }

    const contactMethod = new ContactMethod();
    contactMethod.id = profile.contactMethods.length + 1;
    contactMethod.email = createContactMethodDto.email;

    profile.contactMethods.push(contactMethod);

    await this.profileRepository.save(profile);

    return profile;
  }

  async removeContactMethod(
    id: number,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne({
      where: { id: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const updatedContactMethodList = profile.contactMethods.filter(
      (contactMethod) => contactMethod.id !== id,
    );

    profile.contactMethods = updatedContactMethodList;

    await this.profileRepository.save(profile);
    return;
  }
  private UserProfilePresenter(profile: Profile) {
    const { skillsProfile, languageProfile, ...otherProfileProps } = profile;

    const mappedProfile = {
      ...otherProfileProps,
      skills: skillsProfile.map(({ skill, ...sp }) => ({
        id: skill.id,
        name: skill.name,
        type: skill.type,
        skillProfileId: sp.id,
        isVisible: sp.isVisible,
      })),
      languages: profile.languageProfile.map(({ language, ...lp }) => ({
        ...lp,
        name: language.name,
      })),
    };

    return mappedProfile;
  }

  async updateVisibilitySkill(
    skillId: number,
    user: UserActiveInterface,
    visible: UpdateIsVisibleDto,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne({
      relations: ['skillsProfile'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const skillProfile = profile.skillsProfile.find(
      (skillProfile) => skillProfile.skillId === skillId,
    );

    if (!skillProfile) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    skillProfile.isVisible = visible.isVisible;

    await this.skillsProfileRepository.save(skillProfile);
    return;
  }

  async updateVisibilityLanguage(
    languageProfileId: number,
    user: UserActiveInterface,
    visible: UpdateIsVisibleDto,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne({
      relations: ['languageProfile', 'languageProfile.language'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const languageProfile = profile.languageProfile.find(
      (languageProfile) => languageProfile.id === languageProfileId,
    );

    if (!languageProfile) {
      throw new NotFoundException(ERROR_LANGUAGE_NOT_FOUND);
    }

    languageProfile.isVisible = visible.isVisible;

    await this.languageProfileRepository.save(languageProfile);
    return;
  }
}
