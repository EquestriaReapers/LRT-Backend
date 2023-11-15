import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/profiles/entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtPayloadService } from 'src/common/service/jwt.payload.service';
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly jwtPayloadService: JwtPayloadService,

  ) {}

  async create(createUserDto: CreateUserDto) {
      const user = this.userRepository.create(createUserDto);

      createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);

      await this.userRepository.save(user);

      const getUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });


      const perfil = this.profileRepository.create({userId: +getUser.id, description: "default", image: "default"});
      await this.profileRepository.save(perfil);

      const token = await this.jwtPayloadService.createJwtPayload(user);

      const response = {
        ...getUser,
        perfil,
        token
      }

      return response;
  }

  async findAll() {
    return await this.userRepository.find();  
  }

  async findOne(@Param('id') id: number) {
      const user = await this.userRepository.findOneBy({id});

        if (!user) {
          throw new NotFoundException('user not found')
        }
        
        return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role', 'verified'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
      const user = await this.userRepository.update({id}, updateUserDto);

      if (user.affected === 0) {
        throw new NotFoundException('user not found')
      }

      return user;
  }

  async remove(id: number) {
      const user = await this.userRepository.softDelete({id});
      // const user = await this.userRepository.softRemove({id});

      if (!user) {
        throw new NotFoundException('user not found')
      }

      return user;
    
  }
}
