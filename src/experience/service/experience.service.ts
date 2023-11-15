import { Injectable, NotFoundException, Param } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Experience } from '../entities/experience.entity';
import { UpdateExperienceDto } from '../dto/update-experience.dto';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { CreateExperienceDto } from '../dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,

  ) { }

  async findAll() {
    return await this.experienceRepository.find({
      relations: ['profile']
    });
  }

  async findOne(@Param('id') id: number) {
    const experiencia = await this.experienceRepository.findOne({ where: { userId: id }, relations: ['profile'] });
    if (!experiencia) {
      throw new NotFoundException('Experiencia no encontrada')
    }

    return experiencia;
  }

  async findAllMy(user: UserActiveInterface) {
    return await this.experienceRepository.find({ where: { userId: user.id }, relations: ['profile'] });
  }

  async create(createExperienceDto: CreateExperienceDto) {
    const experiencia = this.experienceRepository.create(createExperienceDto);
    await this.experienceRepository.save(experiencia);

    return experiencia;
  }

  async createMyExperiencia(createExperienceDto: CreateExperienceDto, user: UserActiveInterface) {
    const experiencia = this.experienceRepository.create({ ...createExperienceDto, userId: user.id });
    await this.experienceRepository.save(experiencia);

    return experiencia;
  }


  async updateMyExperiencia(updateExperienciaDto: UpdateExperienceDto, user: UserActiveInterface) {
    const experiencia = await this.experienceRepository.update(
      user.id,
      {
        ...updateExperienciaDto,

      });

    if (experiencia.affected === 0) {
      throw new NotFoundException('Experiencia no encontrada')
    }

    return experiencia
  }

  async update(id: number, updateExperienciaDto: UpdateExperienceDto) {
    const experiencia = await this.experienceRepository.update(
      id,
      {
        ...updateExperienciaDto
      });

    if (experiencia.affected === 0) {
      throw new NotFoundException('Experiencia no encontrada')
    }

    return experiencia;
  }


  async remove(id: number) {
    const experiencia = await this.experienceRepository.softDelete(id);

    if (!experiencia) {
      throw new NotFoundException('Experiencia no encontrada')
    }

    return experiencia;

  }
}
