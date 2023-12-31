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
import { EDUCATION_NOT_FOUND, ERROR_EDUCATION_IS_UCAB } from '../message';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
    user: UserActiveInterface,
  ) {
    const newEducation = await this.educationRepository.save({
      ...createEducationDto,
      profileId: user.id,
      isUCAB: false,
    });

    return newEducation;
  }

  async findAll(idProfile: number) {
    const educations = await this.educationRepository.find({
      where: {
        deleteAt: null,
        profileId: idProfile,
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
      education = await this.educationRepository.update(
        {
          id,
          profileId: user.id,
        },
        {
          principal: updateEducationDto.principal,
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
