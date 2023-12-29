import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portafolio } from '../entities/portafolio.entity';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import { CreatePortafolioDto } from '../dto/create-portafolio.dto';
import { UpdatePortafolioDto } from '../dto/update-portafolio.dto';

@Injectable()
export class PortafolioService {
  constructor(
    @InjectRepository(Portafolio)
    private portafolioRepository: Repository<Portafolio>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) { }

  async create(profileId: number, createPortafolioDto: CreatePortafolioDto) {
    const profile = await this.profileRepository.findOne({ where: { id: profileId } });
    const newPortafolio = this.portafolioRepository.create({
      ...createPortafolioDto,
      profile,
    });
    return await this.portafolioRepository.save(newPortafolio);
  }

  async findAll() {
    return await this.portafolioRepository.find({ relations: ['profile'] });
  }

  async findOne(id: number) {
    return await this.portafolioRepository.findOne({ where: { id: id } });
  }

  async findByProfile(profileId: number) {
    return await this.portafolioRepository.find({ where: { profile: { id: profileId } } });
  }
  async update(id: number, updatePortafolioDto: UpdatePortafolioDto) {
    await this.portafolioRepository.update(id, updatePortafolioDto);
    return await this.portafolioRepository.findOne({ where: { id: id }, relations: ['profile'] });
  }

  async remove(id: number) {
    await this.portafolioRepository.delete(id);
    return { deleted: true };
  }
}