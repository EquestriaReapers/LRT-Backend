import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { Skill } from '../../skills/entities/skill.entity';
import { User } from '../../users/entities/user.entity';
import { PROFILE_NOT_FOUND } from '../messages';
import { PaginationMessage } from '../../../common/interface/pagination-message.interface';
import { AppService } from 'src/app.service';
import { Console } from 'console';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll({ page, limit, random }) {
    const skip = (page - 1) * limit;

    if (!random) {
      random = Math.random();
    }

    const queryBuilder = await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.skills', 'skills')
      .leftJoinAndSelect('profile.experience', 'experience')
      .select([
        'profile.id',
        'profile.userId',
        'profile.description',
        'profile.mainTitle',
        'profile.countryResidence',
        'profile.deletedAt',
        'user.name',
        'user.lastname',
        'user.email',
        'skills.id',
        'skills.name',
        'skills.level',
        'experience.id',
        'experience.profileId',
        'experience.name',
        'experience.role',
        'experience.startDate',
        'experience.endDate',
      ])
      .skip(skip)
      .take(limit);

    const profiles = await queryBuilder.getMany();
    const totalCount = await this.profileRepository.count();

    const pagination: PaginationMessage = {
      itemCount: profiles.length,
      totalItems: totalCount,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      randomSeed: random,
    };

    const response = { profiles, pagination };

    return response;
  }

  async findOne(id: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId: id },
      relations: {
        user: true,
        skills: true,
        experience: true,
      },
      select: {
        user: {
          name: true,
          lastname: true,
          email: true,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no se encuentra');
    }

    return profile;
  }

  async updateMyProfile(
    updateProfileDto: UpdateProfileDto,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.update(user.id, {
      description: updateProfileDto.description,
    });

    if (profile.affected === 0) {
      throw new NotFoundException('Perfil no se encuentra');
    }

    if (updateProfileDto.name) {
      const userUpdated = await this.userRepository.update(user.id, {
        name: updateProfileDto.name,
      });

      if (userUpdated.affected === 0) {
        throw new NotFoundException('Usuario no se encuentra');
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
      throw new NotFoundException('Perfil o habilidades no se encuentra');
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
      throw new NotFoundException('Perfil no se encuentra');
    }

    const skill = await this.skillRepository.findOneBy({ id: skillId });

    if (!skill) {
      throw new NotFoundException('Habilidad no se encuentra');
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
      ...updateProfileDto,
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    if (updateProfileDto.name) {
      const userUpdateResult = await this.userRepository.update(userId, {
        name: updateProfileDto.name,
      });

      if (userUpdateResult.affected === 0) {
        throw new NotFoundException('Usuario no se encuentra');
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
