import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { ILike, Like, Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SKILL_NOT_FOUND } from '../messages';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import { PROFILE_NOT_FOUND } from 'src/core/profiles/messages';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillsRepository: Repository<Skill>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(createSkillDto: CreateSkillDto) {
    // Create a new skill instance
    const newSkill = await this.skillsRepository.create(createSkillDto);
    // Save this skill instance to the database
    return this.skillsRepository.save(newSkill);
  }

  async createSkillAndUserAsing(
    skill: CreateSkillDto,
    user: UserActiveInterface,
  ) {
    const skillFound = await this.skillsRepository.findOne({
      where: { name: skill.name },
    });

    if (skillFound) {
      throw new ConflictException('Skill already exists');
    }

    const newSkill = await this.skillsRepository.save(skill);

    const profile = await this.profileRepository.findOne({
      relations: ['skills'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    profile.skills.push(newSkill);

    await this.profileRepository.save(profile);

    return {
      skill: newSkill,
    };
  }

  async findAll(name?: string) {
    const queryOptions: any = {};

    if (name) {
      queryOptions.where = {
        name: ILike(`%${name}%`),
      };
    }

    return await this.skillsRepository.find(queryOptions);
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

    if (!skill) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    return;
  }

  async remove(id: number): Promise<void> {
    const skill = await this.skillsRepository.delete({ id });
    return;
  }
}
