import { Injectable, NotFoundException, Param } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { UpdateExperienceDto } from '../dto/update-experience.dto';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { ExperienceCreateResponseDTO } from '../dto/create-experience.dto';
import { EXPERIENCE_NOT_FOUND } from '../messages';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async findAll() {
    return await this.experienceRepository.find({
      relations: {
        profile: true,
      },
    });
  }

  async findOne(id: number) {
    const experience = await this.experienceRepository.findOne({
      where: { id: id },
      relations: ['profile'],
    });
    if (!experience) {
      throw new NotFoundException(EXPERIENCE_NOT_FOUND);
    }

    return experience;
  }

  async create(createExperienceDto: ExperienceCreateResponseDTO) {
    const experience = this.experienceRepository.create(createExperienceDto);
    await this.experienceRepository.save(experience);

    return experience;
  }

  async createMyExperience(
    createExperienceDto: ExperienceCreateResponseDTO,
    user: UserActiveInterface,
  ) {
    const experience = this.experienceRepository.create({
      ...createExperienceDto,
      profileId: user.id,
    });
    await this.experienceRepository.save(experience);

    return experience;
  }

  async updateMyExperience(
    id: number,
    updateExperienceDto: UpdateExperienceDto,
    user: UserActiveInterface,
  ): Promise<void> {
    const experience = await this.experienceRepository.update(
      { profileId: user.id, id },
      updateExperienceDto,
    );

    if (experience.affected === 0) {
      throw new NotFoundException(EXPERIENCE_NOT_FOUND);
    }

    return;
  }

  async removeMyExperience(
    id: number,
    user: UserActiveInterface,
  ): Promise<void> {
    const experienceToRemove = await this.experienceRepository.findOne({
      where: { profileId: user.id, id },
    });

    await this.experienceRepository.remove(experienceToRemove);

    return;
  }

  async update(
    id: number,
    updateExperienciaDto: UpdateExperienceDto,
  ): Promise<void> {
    const experience = await this.experienceRepository.update(id, {
      ...updateExperienciaDto,
    });

    if (experience.affected === 0) {
      throw new NotFoundException(EXPERIENCE_NOT_FOUND);
    }

    return;
  }

  async remove(id: number): Promise<void> {
    const experience = await this.experienceRepository.softDelete(id);

    if (!experience) {
      throw new NotFoundException(EXPERIENCE_NOT_FOUND);
    }

    return;
  }
}
