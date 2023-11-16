import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { Skill } from 'src/skills/entities/skill.entity';
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
    const profiles = await this.profileRepository.find({ relations: {
      skills: true,
      user: true,
      experience: true
    }});

    return profiles;
  }

  async findOne(@Param('id') id: number) {
    const profile = await this.profileRepository.findOne({ where: { userId: id }, relations: ['user', 'skills', 'experience'] });
      if (!profile) {
        throw new NotFoundException('Perfil no se encuentra')
      }
      
      return profile;
}

async updateMyProfile (updateProfileDto: UpdateProfileDto, file: Express.Multer.File, user: UserActiveInterface) {
  let imagePath = file ? process.env.DATABASE_URL + file.path.replace("\\", "/") : "default";
  const profile = await this.profileRepository.update(
    user.id,
    {
      description: updateProfileDto.description,
      image: imagePath
    }
  );
  
  if (profile.affected === 0) {
    throw new NotFoundException('Perfil no se encuentra')
  }

  if (updateProfileDto.name) {
    const userUpdated = await this.userRepository.update(
      user.id,
      {
        name: updateProfileDto.name,
      }
    );

    if (userUpdated.affected === 0) {
      throw new NotFoundException('Usuario no se encuentra')
    }
  }

  return profile
}

async addSkillProfile(skillId: number, user: UserActiveInterface) {
  const profile = await this.profileRepository.findOne({ where: { userId: user.id }});
  const skill = await this.skillRepository.findOne({ where: { id: skillId }});

  if (!profile || !skill) {
    throw new NotFoundException('Perfil o habilidades no se encuentra');
  }

  // Asegúrate de que la propiedad "anime" de la lista sea un array antes de agregar el anime
  if (!profile.skills) {
    profile.skills = [];
  }

  // Agrega el anime a la lista
  profile.skills.push(skill);

  // Guarda la lista actualizada en la base de datos
  return await this.profileRepository.save(profile);
}

async removeSkillProfile(skillId: number, user: UserActiveInterface) {
  const profile = await this.profileRepository.findOne({
    relations: ['skills'],
    where: { userId: user.id }
  });

  if (!profile) {
    throw new NotFoundException('Perfil no se encuentra');
  }

  const skill = await this.skillRepository.findOneBy({ id: skillId });

  if (!skill) {
    throw new NotFoundException('Habilidad no se encuentra');
  }

  // Ahora, realiza la lógica para eliminar el anime de la lista
  const updatedSkillList = profile.skills.filter(skillItem => skillItem.id !== skillId);

  // Actualiza la propiedad `anime` de la lista con el nuevo contenido
  profile.skills = updatedSkillList;

  // Guarda la lista actualizada en la base de datos
  return await this.profileRepository.save(profile);

}

async update(id: number, updateProfileDto: UpdateProfileDto, file: Express.Multer.File) {
  let imagePath = file ? process.env.DATABASE_URL + file.path.replace("\\", "/") : "default";
  const profile = await this.profileRepository.update(
    id,
    {
      description: updateProfileDto.description,
      image: imagePath
    }
  );

  if (profile.affected === 0) {
    throw new NotFoundException('Perfil no se encuentra');
  }

  if (updateProfileDto.name) {
    const userUpdateResult = await this.userRepository.update(
      id,
      {
        name: updateProfileDto.name,
      }
    );

    if (userUpdateResult.affected === 0) {
      throw new NotFoundException('Usuario no se encuentra');
    }
  }

  return profile
}

  async remove(id: number) {
    const profile = await this.profileRepository.softDelete(id);
    // const user = await this.userRepository.softRemove({id});

    if (!profile) {
      throw new NotFoundException('Perfil no se encuentra')
    }

    return profile;
  
  }
}
