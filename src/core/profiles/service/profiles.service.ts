import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { Skill } from '../../skills/entities/skill.entity';
import { User } from '../../users/entities/user.entity';
import { PROFILE_NOT_FOUND } from '../messages';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const profiles = await this.profileRepository.find({
      relations: {
        user: true,
        skills: true,
        experience: true,
      },
      select: {
        user: {
          name: true,
          email: true,
        },
      },
    });

    return profiles;
  }

  async findOne(@Param('id') id: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId: id },
      relations: {
        user: true,
        skills: true,
        experience: true,
      },
      select: {
        user: {
          name: true,
          email: true,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no se encuentra');
    }

    return profile;
  }

  async updateMyProfile(
    updateProfileDto: UpdateProfileDto,
    user: UserActiveInterface,
  ) {
    const profile = await this.profileRepository.update(user.id, {
      description: updateProfileDto.description,
    });

    if (profile.affected === 0) {
      throw new NotFoundException('Perfil no se encuentra');
    }

    if (updateProfileDto.name) {
      const userUpdated = await this.userRepository.update(user.id, {
        name: updateProfileDto.name,
      });

      if (userUpdated.affected === 0) {
        throw new NotFoundException('Usuario no se encuentra');
      }
    }

    return profile;
  }

  async addSkillProfile(skillId: number, user: UserActiveInterface) {
    const profile = await this.profileRepository.findOne({
      where: { userId: user.id },
    });
    const skill = await this.skillRepository.findOne({
      where: { id: skillId },
    });

    if (!profile || !skill) {
      throw new NotFoundException('Perfil o habilidades no se encuentra');
    }

    // Asegúrate de que la propiedad "skills" de la lista sea un array antes de agregar el anime
    if (!profile.skills) {
      profile.skills = [];
    }

    // Agrega el skill a la lista
    profile.skills.push(skill);

    // Guarda la lista actualizada en la base de datos
    return await this.profileRepository.save(profile);
  }

  async removeSkillProfile(skillId: number, user: UserActiveInterface) {
    const profile = await this.profileRepository.findOne({
      relations: ['skills'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no se encuentra');
    }

    const skill = await this.skillRepository.findOneBy({ id: skillId });

    if (!skill) {
      throw new NotFoundException('Habilidad no se encuentra');
    }

    // Ahora, realiza la lógica para eliminar el anime de la lista
    const updatedSkillList = profile.skills.filter(
      (skillItem) => skillItem.id !== skillId,
    );

    // Actualiza la propiedad `skills` de la lista con el nuevo contenido
    profile.skills = updatedSkillList;

    // Guarda la lista actualizada en la base de datos
    return await this.profileRepository.save(profile);
  }

  async update(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    const profile = await this.profileRepository.update(userId, {
      ...updateProfileDto,
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    if (updateProfileDto.name) {
      const userUpdateResult = await this.userRepository.update(userId, {
        name: updateProfileDto.name,
      });

      if (userUpdateResult.affected === 0) {
        throw new NotFoundException('Usuario no se encuentra');
      }
    }

    return;
  }

  async remove(id: number) {
    const profile = await this.profileRepository.softDelete(id);

    if (!profile) throw new NotFoundException(PROFILE_NOT_FOUND);

    return profile;
  }
}
