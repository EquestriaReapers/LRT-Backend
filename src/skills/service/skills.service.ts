import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SkillsService {

  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    // Create a new skill instance
    const newSkill = await this.skillsRepository.create(createSkillDto);
    // Save this skill instance to the database
    return this.skillsRepository.save(newSkill);
  }

  async findAll() {
    return await this.skillsRepository.find();
  }

  async findOne(id: number) {
    const skill = await this.skillsRepository.findOneBy({id});
    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto) {
    const skill = await this.skillsRepository.update({id}, updateSkillDto);
    return skill;
  }

  async remove(id: number) {
    const skill = await this.skillsRepository.delete({id});
  }
}
