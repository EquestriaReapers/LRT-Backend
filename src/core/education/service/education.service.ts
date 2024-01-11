import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEducationDto } from '../dto/create-education.dto';
import { UpdateEducationDto } from '../dto/update-education.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from '../entities/education.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import {
  EDUCATION_NOT_FOUND,
  ERROR_EDUCATION_IS_UCAB,
  ERROR_EDUCATION_PRINCIPAL_ALREADY_EXISTS,
  ERROR_EDUCATION_PRINCIPAL_NOT_UPDATED,
} from '../message';
import { Profile } from 'src/core/profiles/entities/profile.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
    user: UserActiveInterface,
  ) {
    const newEducation = await this.educationRepository.save({
      ...createEducationDto,
      profileId: user.id,
      isUCAB: false,
      isVisible: true,
    });

    return newEducation;
  }

  async findAll(idProfile: number) {
    const educations = await this.educationRepository.find({
      where: {
        deleteAt: null,
        profileId: idProfile,
      },
      order: {
        principal: 'DESC',
        isUCAB: 'DESC',
      },
    });

    if (educations.length === 0) {
      throw new NotFoundException(EDUCATION_NOT_FOUND);
    }

    return educations;
  }

  async findOne(id: number) {
    const education = await this.educationRepository.findOne({
      where: {
        id,
      },
    });

    if (!education) {
      throw new NotFoundException(EDUCATION_NOT_FOUND);
    }

    return education;
  }

  async update(
    id: number,
    updateEducationDto: UpdateEducationDto,
    user: UserActiveInterface,
  ): Promise<void> {
    let education;

    const currentEducation = await this.educationRepository.findOne({
      where: {
        profileId: user.id,
        id: id,
      },
    });

    if (
      currentEducation.isUCAB === true &&
      (updateEducationDto.principal === true ||
        updateEducationDto.principal === false)
    ) {
      const principalEducation = await this.educationRepository.findOne({
        where: {
          profileId: user.id,
          principal: true,
        },
      });

      if (principalEducation.id === id) {
        throw new BadRequestException(ERROR_EDUCATION_PRINCIPAL_NOT_UPDATED);
      }

      await this.educationRepository.update(
        {
          id: principalEducation.id,
          profileId: user.id,
        },
        {
          principal: false,
        },
      );

      education = await this.educationRepository.update(
        {
          id,
          profileId: user.id,
        },
        {
          principal: updateEducationDto.principal,
        },
      );

      await this.profileRepository.update(
        {
          id: user.id,
        },
        {
          mainTitle: currentEducation.title,
        },
      );
    }

    if (currentEducation.isUCAB === false) {
      education = await this.educationRepository.update(
        {
          id,
          profileId: user.id,
        },
        {
          ...updateEducationDto,
          principal: false,
          isUCAB: false,
        },
      );
    }

    if (education.affected === 0) {
      throw new NotFoundException(EDUCATION_NOT_FOUND);
    }

    return;
  }

  async remove(id: number, user: UserActiveInterface): Promise<void> {
    const currentEducation = await this.educationRepository.findOne({
      where: {
        profileId: user.id,
        id,
      },
    });

    if (currentEducation.isUCAB) {
      throw new BadRequestException(ERROR_EDUCATION_IS_UCAB);
    }

    const education = await this.educationRepository.softDelete({
      id,
      profileId: user.id,
    });

    if (education.affected === 0) {
      throw new NotFoundException(EDUCATION_NOT_FOUND);
    }

    return;
  }
}
