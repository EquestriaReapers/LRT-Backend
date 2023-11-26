import { Injectable, NotFoundException, Param } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { UpdateExperienceDto } from '../dto/update-experience.dto';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { CreateExperienceDto } from '../dto/create-experience.dto';

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

  async findOne(@Param('id') id: number) {
    const experience = await this.experienceRepository.findOne({
      where: { id: id },
      relations: ['profile'],
    });
    if (!experience) {
      throw new NotFoundException('Experiencia no encontrada');
    }

    return experience;
  }

  async findAllMy(user: UserActiveInterface) {
    return await this.experienceRepository.find({
      where: { profileId: user.id },
    });
  }

  async create(createExperienceDto: CreateExperienceDto) {
    const experience = this.experienceRepository.create(createExperienceDto);
    await this.experienceRepository.save(experience);

    return experience;
  }

  async createMyExperience(
    createExperienceDto: CreateExperienceDto,
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
  ) {
    const experience = await this.experienceRepository.update(
      { profileId: user.id, id },
      updateExperienceDto,
    );

    if (experience.affected === 0) {
      throw new NotFoundException('Experiencia no encontrada');
    }

    return experience;
  }

  async update(id: number, updateExperienciaDto: UpdateExperienceDto) {
    const experience = await this.experienceRepository.update(id, {
      ...updateExperienciaDto,
    });

    if (experience.affected === 0) {
      throw new NotFoundException('Experiencia no encontrada');
    }

    return experience;
  }

  async remove(id: number) {
    const experience = await this.experienceRepository.softDelete(id);

    if (!experience) {
      throw new NotFoundException('Experiencia no encontrada');
    }

    return experience;
  }
}
