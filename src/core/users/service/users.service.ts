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
        'documentNumber',
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

  async AssingUcabEducation(userId: number) {
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

    const educationUCAB = await this.httpService
      .get(`${envData.API_BANNER_URL}email` + '/' + user.email)
      .toPromise()
      .then((response) => response.data);

    if (educationUCAB) {
    }
  }
}
