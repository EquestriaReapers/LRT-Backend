import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { Like, Repository } from 'typeorm';
import { Skill, SkillType } from '../entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SKILL_NOT_FOUND } from '../messages';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,
  ) { }

  async create(createSkillDto: CreateSkillDto) {
    // Create a new skill instance
    const newSkill = await this.skillsRepository.create(createSkillDto);
    // Save this skill instance to the database
    return this.skillsRepository.save(newSkill);
  }

  async findAll(name: string, type: SkillType) {
    return await this.skillsRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }

  async findOne(id: number) {
    const skill = await this.skillsRepository.findOneBy({ id });

    if (!skill) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<void> {
    const skill = await this.skillsRepository.update({ id }, updateSkillDto);

    if (!skill.affected) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    return;
  }

  async remove(id: number): Promise<void> {
    const skill = await this.skillsRepository.delete({ id });
    return;
  }
}
