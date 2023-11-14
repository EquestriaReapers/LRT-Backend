import { Injectable, NotFoundException, Param } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Experiencia } from '../entities/experiencia.entity';
import { UpdateExperienciaDTO } from '../dto/update-experiencia.dto';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { CreateExperienciaDTO } from '../dto/create-experiencia.dto';


@Injectable()
export class ExperienciaService {
  constructor(
    @InjectRepository(Experiencia)
    private readonly experienciaRepository: Repository<Experiencia>,

  ) { }

  async findAll() {
    return await this.experienciaRepository.find({
      relations: ['profile']
    });
  }

  async findOne(@Param('id') id: number) {
    const experiencia = await this.experienciaRepository.findOne({ where: { profileId: id }, relations: ['profile'] });
    if (!experiencia) {
      throw new NotFoundException('experiencia no encontrada')
    }

    return experiencia;
  }

  async create(createExperienciaDTO: CreateExperienciaDTO) {
    const experiencia = this.experienciaRepository.create(createExperienciaDTO);
    await this.experienciaRepository.save(experiencia);

    return experiencia;
  }

  async createMyExperiencia(createExperienciaDTO: CreateExperienciaDTO, user: UserActiveInterface) {
    const experiencia = this.experienciaRepository.create({ ...createExperienciaDTO, profileId: user.id });
    await this.experienciaRepository.save(experiencia);

    return experiencia;
  }


  async updateMyExperiencia(updateExperienciaDto: UpdateExperienciaDTO, user: UserActiveInterface) {
    const experiencia = await this.experienciaRepository.update(
      user.id,
      {
        ...updateExperienciaDto,

      });

    if (experiencia.affected === 0) {
      throw new NotFoundException('experiencia')
    }

    return experiencia
  }

  async update(id: number, updateExperienciaDto: UpdateExperienciaDTO) {
    const experiencia = await this.experienciaRepository.update(
      id,
      {
        ...updateExperienciaDto
      });

    if (experiencia.affected === 0) {
      throw new NotFoundException('experiencia no encontrada')
    }

    return experiencia;
  }


  async remove(id: number) {
    const experiencia = await this.experienciaRepository.softDelete(id);

    if (!experiencia) {
      throw new NotFoundException('Experiencia no encontrada')
    }

    return experiencia;

  }
}
