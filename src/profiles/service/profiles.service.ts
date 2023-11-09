import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { Skill } from 'src/skills/entities/skill.entity';
import { AddSkillDto } from '../dto/add-skill.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  
  async findAll() {
    return await this.profileRepository.find({
      relations: ['user']
    });
  }

  async findOne(@Param('id') id: number) {
    const profile = await this.profileRepository.findOne({ where: { userId: id }, relations: ['user'] });
      if (!profile) {
        throw new NotFoundException('profile not found')
      }
      
      return profile;
}

async updateMyProfile (updateProfileDto: UpdateProfileDto, file: Express.Multer.File, user: UserActiveInterface) {
  let imagePath = file ? process.env.DATABASE_URL + file.path.replace("\\", "/") : "default";
  const profile = await this.profileRepository.update(
    user.id,
  {
    ...updateProfileDto,
    image: imagePath
  });
  
  if (profile.affected === 0) {
    throw new NotFoundException('profile not found')
  }

  return profile
}

async update(id: number, updateProfileDto: UpdateProfileDto, file: Express.Multer.File) {
  let imagePath = file ? process.env.DATABASE_URL + file.path.replace("\\", "/") : "default";
  const profile = await this.profileRepository.update(
    id,
  {
    ...updateProfileDto,
    image: imagePath
  });
  
  if (profile.affected === 0) {
    throw new NotFoundException('profile not found')
  }

  return profile
}

  async remove(id: number) {
    const profile = await this.profileRepository.softDelete(id);
    // const user = await this.userRepository.softRemove({id});

    if (!profile) {
      throw new NotFoundException('profile not found')
    }

    return profile;
  
  }
}
