import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtPayloadService } from '../../../common/service/jwt.payload.service';
import { USER_NOT_FOUND } from '../messages';
import { Education } from 'src/core/education/entities/education.entity';
import { PROFILE_NOT_FOUND } from 'src/core/profiles/messages';
import { HttpService } from '@nestjs/axios';
import { envData } from 'src/config/datasource';
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,

    private readonly httpService: HttpService,

    private readonly jwtPayloadService: JwtPayloadService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);

    createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);

    await this.userRepository.save(user);

    const _user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const profile = await this.profileRepository.save({
      userId: _user.id,
      description: null,
      mainTitle: null,
      countryResidence: null,
      website: null,
    });

    await this.AssingUcabEducation(_user.id);
    await this.principalEducation(_user.id);

    const token = await this.jwtPayloadService.createJwtPayload(user);

    const response = {
      user: _user,
      profile,
      token,
    };

    return response;
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'name',
        'lastname',
        'email',
        'password',
        'role',
        'verified',
      ],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.update({ id }, updateUserDto);

    if (user.affected === 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return;
  }

  async remove(id: number) {
    const user = await this.userRepository.softDelete({ id });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  private async AssingUcabEducation(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const profile = await this.profileRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    let educationUCAB = await this.httpService
      .get(`${envData.API_BANNER_URL}student/email` + '/' + user.email)
      .toPromise()
      .then((response) => response.data);

    if (educationUCAB) {
      const filteredCareers = educationUCAB.StudentCareers.filter(
        (studentCareers) =>
          studentCareers.dateGraduated !== null && studentCareers.Career,
      );

      if (filteredCareers.length === 0) {
        await this.profileRepository.delete({ userId: user.id });
        await this.userRepository.delete({ id: user.id });
        throw new NotFoundException('Este estudiante no se ha graduado');
      }

      for (const studentCareers of filteredCareers) {
        await this.educationRepository.save({
          profileId: profile.id,
          entity: 'Universidad Catolica Andres Bello',
          title: this.getMainTitle(studentCareers.Career.name),
          endDate: studentCareers.dateGraduated,
          isUCAB: true,
          principal: false,
        });
      }
    }

    return educationUCAB;
  }

  private async principalEducation(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const profile = await this.profileRepository.findOne({
      where: { userId: userId },
    });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    if (!profile) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const orderedEducation = await this.educationRepository.find({
      where: { profileId: profile.id },
      order: { endDate: 'ASC' }, // Ordenar por fecha de finalización en orden descendente
    });

    if (
      orderedEducation === null ||
      !orderedEducation ||
      orderedEducation.length === 0
    ) {
      throw new NotFoundException(
        'No se encontraron estudios para este usuario',
      );
    }

    let educationOld = orderedEducation[0];

    const educationPrincipal = await this.educationRepository.update(
      {
        profileId: profile.id,
        isUCAB: true,
        id: educationOld.id,
      },
      {
        principal: true,
      },
    );

    if (educationPrincipal.affected === 0) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    await this.profileRepository.update(
      {
        userId: user.id,
      },
      {
        mainTitle: this.getMainTitle(educationOld.title),
      },
    );

    return educationPrincipal;
  }

  async updateEducationOnLogin(email: string) {
    const externalEducationData = await this.findByEmailBanner(email);

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(PROFILE_NOT_FOUND);
    }

    const profile = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    const currentEducation = await this.educationRepository.find({
      where: { profileId: profile.id },
    });

    const currentEducationNames = currentEducation.map(
      (education) => education.title,
    );

    let newEducations = [];

    if (externalEducationData) {
      const filteredCareers = externalEducationData.StudentCareers.filter(
        (studentCareers) =>
          studentCareers.dateGraduated !== null && studentCareers.Career,
      );

      if (filteredCareers.length > 0) {
        newEducations = filteredCareers.filter(
          (career) =>
            !currentEducationNames.includes(
              this.getMainTitle(career.Career.name),
            ),
        );
      }
    }

    for (const education of newEducations) {
      const newEducation = this.educationRepository.create({
        profileId: profile.id,
        entity: 'Universidad Catolica Andres Bello',
        title: this.getMainTitle(education.Career.name),
        endDate: education.dateGraduated,
        isUCAB: true,
        principal: false,
      });
      await this.educationRepository.save(newEducation);
    }

    return newEducations;
  }

  async findByEmailBanner(email: string) {
    return await this.httpService
      .get(`${envData.API_BANNER_URL}student/email` + '/' + email)
      .toPromise()
      .then((response) => response.data);
  }

  private getMainTitle(mainTitle: string): string {
    if (mainTitle) {
      mainTitle = mainTitle
        .split('-')
        .map((word, index) =>
          index !== 1 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
        )
        .join(' ');
      return mainTitle;
    }

    return '';
  }
}
