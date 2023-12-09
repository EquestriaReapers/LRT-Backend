import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { Skill } from '../../skills/entities/skill.entity';
import { User } from '../../users/entities/user.entity';
import { ERROR_PROFILE_SKILL_NOT_FOUND, PROFILE_NOT_FOUND } from '../messages';
import { USER_NOT_FOUND } from 'src/core/users/messages';
import { SKILL_NOT_FOUND } from 'src/core/skills/messages';
import FindAllPaginateAction from './find-all-paginate.action';
import { ResponsePaginationProfile } from '../dto/responses.dto';
import { FindAllPayload } from '../dto/find-all-payload.interface';

@Injectable()
export default class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly findAllPaginateAction: FindAllPaginateAction,
  ) {}

  async findAllPaginate(
    opt: FindAllPayload,
  ): Promise<ResponsePaginationProfile> {
    return await this.findAllPaginateAction.execute(opt);
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId: id },
      relations: [
        'user',
        'skills',
        'experience',
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
    });
    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const mappedProfile = {
      ...profile,
      languageProfile: profile.languageProfile.map(({ language, ...lp }) => ({
        ...lp,
        name: language.name,
      })),
    };

    return mappedProfile;
  }

  async updateMyProfile(
    updateProfileDto: UpdateProfileDto,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.update(user.id, {
      description: updateProfileDto.description,
      mainTitle: updateProfileDto.mainTitle,
      countryResidence: updateProfileDto.countryResidence,
    });

    if (profile.affected === 0) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    if (updateProfileDto.name) {
      const userUpdated = await this.userRepository.update(user.id, {
        name: updateProfileDto.name,
      });

      if (userUpdated.affected === 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
    }

    return;
  }

  async addSkillProfile(skillId: number, user: UserActiveInterface) {
    const profile = await this.profileRepository.findOne({
      where: { userId: user.id },
    });
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });

    if (!profile || !skill) {
      throw new NotFoundException(ERROR_PROFILE_SKILL_NOT_FOUND);
    }

    if (!profile.skills) {
      profile.skills = [];
    }

    profile.skills.push(skill);

    return await this.profileRepository.save(profile);
  }

  async removeSkillProfile(
    skillId: number,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne({
      relations: ['skills'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const skill = await this.skillRepository.findOneBy({ id: skillId });

    if (!skill) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    const updatedSkillList = profile.skills.filter(
      (skillItem) => skillItem.id !== skillId,
    );

    profile.skills = updatedSkillList;

    await this.profileRepository.save(profile);
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
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    if (updateProfileDto.name) {
      const userUpdateResult = await this.userRepository.update(userId, {
        name: updateProfileDto.name,
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
}
