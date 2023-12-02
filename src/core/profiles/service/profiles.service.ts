import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../../../common/interface/user-active-interface';
import { Skill } from '../../skills/entities/skill.entity';
import { User } from '../../users/entities/user.entity';
import { PROFILE_NOT_FOUND } from '../messages';
import { PaginationMessage } from '../../../common/interface/pagination-message.interface';
import { AppService } from 'src/app.service';
import { Console } from 'console';
import { USER_NOT_FOUND } from 'src/core/users/messages';
import { SKILL_NOT_FOUND } from 'src/core/skills/messages';

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

  async findAll({ page, limit, random }) {
    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    if (!random) {
      random = Math.random();
    }

    await this.profileRepository.query(
      `SELECT 0
    FROM (
          SELECT setseed(${random})
        ) AS randomization_seed;`,
    );

    const queryBuilder = await this.profileRepository.query(
      `
    SELECT "profile"."id" AS "profile_id", "profile"."userId" AS "profile_userId", "profile"."description" AS "profile_description", "profile"."mainTitle" AS "profile_mainTitle", "profile"."countryResidence" AS "profile_countryResidence", "profile"."deletedAt" AS "profile_deletedAt", "user"."id" AS "user_id", "user"."name" AS "user_name", "user"."lastname" AS "user_lastname", "user"."email" AS "user_email", "skills"."id" AS "skills_id", "skills"."name" AS "skills_name", "experience"."id" AS "experience_id", "experience"."profileId" AS "experience_profileId", "experience"."businessName" AS "experience_businessName", "experience"."location" AS "experience_location", "experience"."role" AS "experience_role", "experience"."startDate" AS "experience_startDate", "experience"."endDate" AS "experience_endDate" FROM "profile" "profile" LEFT JOIN "user" "user" ON "user"."id"="profile"."userId" AND ("user"."deletedAt" IS NULL)  LEFT JOIN "profile_skills_skill" "profile_skills" ON "profile_skills"."profileId"="profile"."id" LEFT JOIN "skill" "skills" ON "skills"."id"="profile_skills"."skillId"  LEFT JOIN "experience" "experience" ON "experience"."profileId"="profile"."id" WHERE "profile"."deletedAt" IS NULL ORDER BY RANDOM() ASC LIMIT ${limit} OFFSET ${skip} 
    `,
    );

    const formattedResult = queryBuilder.map((row) => ({
      id: row.profile_id,
      userId: row.profile_userId,
      user: {
        id: row.user_id,
        name: row.user_name,
        lastname: row.user_lastname,
        email: row.user_email,
      },
      description: row.profile_description,
      mainTitle: row.profile_mainTitle,
      countryResidence: row.profile_countryResidence,
      experience: [
        {
          id: row.experience_id,
          profileId: row.experience_profileId,
          businessName: row.experience_businessName,
          location: row.experience_location,
          role: row.experience_role,
          startDate: row.experience_startDate,
          endDate: row.experience_endDate,
        },
      ],
      skills: [
        {
          id: row.skills_id,
          name: row.skills_name,
        },
      ],
      deletedAt: row.profile_deletedAt,
    }));

    const totalCount = await this.profileRepository.count();

    const pagination: PaginationMessage = {
      itemCount: formattedResult.length,
      totalItems: totalCount,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      randomSeed: random,
    };

    const response = { profiles: formattedResult, pagination };

    return response;
  }

  async findOne(id: number) {
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
          lastname: true,
          email: true,
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    return profile;
  }

  async updateMyProfile(
    updateProfileDto: UpdateProfileDto,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.update(user.id, {
      description: updateProfileDto.description,
      mainTitle: updateProfileDto.mainTitle,
      countryResidence: updateProfileDto.countryResidence,
    });

    if (profile.affected === 0) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    if (updateProfileDto.name) {
      const userUpdated = await this.userRepository.update(user.id, {
        name: updateProfileDto.name,
      });

      if (userUpdated.affected === 0) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
    }

    return;
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

    if (!profile.skills) {
      profile.skills = [];
    }

    profile.skills.push(skill);

    return await this.profileRepository.save(profile);
  }

  async removeSkillProfile(
    skillId: number,
    user: UserActiveInterface,
  ): Promise<void> {
    const profile = await this.profileRepository.findOne({
      relations: ['skills'],
      where: { userId: user.id },
    });

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const skill = await this.skillRepository.findOneBy({ id: skillId });

    if (!skill) {
      throw new NotFoundException(SKILL_NOT_FOUND);
    }

    const updatedSkillList = profile.skills.filter(
      (skillItem) => skillItem.id !== skillId,
    );

    profile.skills = updatedSkillList;

    await this.profileRepository.save(profile);
    return;
  }

  async update(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<void> {
    const profile = await this.profileRepository.update(userId, {
      description: updateProfileDto.description,
      mainTitle: updateProfileDto.mainTitle,
      countryResidence: updateProfileDto.countryResidence,
    });

    if (profile.affected === 0) throw new NotFoundException(PROFILE_NOT_FOUND);

    if (updateProfileDto.name) {
      const userUpdateResult = await this.userRepository.update(userId, {
        name: updateProfileDto.name,
      });

      if (userUpdateResult.affected === 0) {
        throw new NotFoundException(USER_NOT_FOUND);
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
