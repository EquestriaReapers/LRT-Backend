import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();  
  }

  async findOne(id: number) {
      const user = await this.userRepository.findOneBy({id});

        if (!user) {
          throw new NotFoundException('user not found')
        }
        
        return user;
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
