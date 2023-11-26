import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { PROFILE_NOT_FOUND } from '../messages';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll(): Promise<Profile[]> {
    return await this.profileRepository.find({
      relations: ['user'],
    });
  }

  async findOne(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!profile) throw new NotFoundException(PROFILE_NOT_FOUND);

    return profile;
  }

  async update(
    userId: number,
    updateProfileDto: UpdateProfileDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const profile = await this.profileRepository.update(userId, {
      ...updateProfileDto,
      image: getProfileImage(file),
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    return;
  }

  async remove(id: number) {
    const profile = await this.profileRepository.softDelete(id);

    if (!profile) throw new NotFoundException(PROFILE_NOT_FOUND);

    return profile;
  }
}

function getProfileImage(file: Express.Multer.File): string {
  return file
    ? process.env.DATABASE_URL + file.path.replace('\\', '/')
    : 'default';
}
