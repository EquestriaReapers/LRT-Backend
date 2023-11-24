import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../service/users.service';
import { Repository } from 'typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../../profiles/entities/profile.entity';
import { JwtPayloadService } from '../../common/service/jwt.payload.service';
import { UserRole } from '../../constants';
import { CreateUserDto } from '../dto/create-user.dto';

const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOneByEmail: jest.fn(),
  softDelete: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })], // Asegúrate de reemplazar 'secret' con tu clave secreta real
      controllers: [UsersController],
      // If you've looked at the complex sample you'll notice that these functions
      // are a little bit more in depth using mock implementation
      // to give us a little bit more control and flexibility in our tests
      // this is not necessary, but can sometimes be helpful in a test scenario
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        JwtPayloadService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    const createUserDto = {
      name: 'Chadwick',
      password: '123456',
      email: 'chadwickboseman@email.com',
      role: UserRole.ADMIN,
    } as CreateUserDto;

    const expectedUser = {
      name: 'Chadwick',
      password: '123456',
      email: 'chadwickboseman@email.com',
      role: UserRole.ADMIN,
      perfil: {
        email: 'chadwickboseman@email.com',
        name: 'Chadwick',
        password: '123456',
        role: 'admin',
      },
    };

    jest.spyOn(mockUserRepository, 'save').mockReturnValue(createUserDto);

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.save).toBeCalled();
    expect(mockUserRepository.save).toBeCalledWith(createUserDto);

    expect(result).toEqual(expectedUser);
  });

  it('findAll => should return an array of user', async () => {
    //arrange
    const expectedUser = {
      name: 'Chadwick',
      password: '123456',
      email: 'chadwickboseman@email.com',
      role: UserRole.ADMIN,
    };

    const users = [expectedUser];
    jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

    //act
    const result = await service.findAll();

    // assert
    expect(result).toEqual(users);
    expect(mockUserRepository.find).toBeCalled();
  });

  it('findOne => should find a user by a given id and return its data', async () => {
    //arrange
    const id = 1;
    const expectedUser = {
      id: 1,
      name: 'Chadwick',
      password: '123456',
      email: 'chadwickboseman@email.com',
      role: UserRole.ADMIN,
    };

    jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(expectedUser);

    //act
    const result = await service.findOne(id);

    expect(result).toEqual(expectedUser);
    expect(mockUserRepository.findOneBy).toBeCalled();
    expect(mockUserRepository.findOneBy).toBeCalledWith({ id });
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    const id = 1;
    const expectedUser = {
      id: 1,
      name: 'Chadwick',
      password: '123456',
      email: 'chadwickboseman@email.com',
      role: UserRole.ADMIN,
    };

    jest.spyOn(mockUserRepository, 'softDelete').mockReturnValue(expectedUser);

    //act
    const result = await service.remove(id);

    expect(result).toEqual(expectedUser);
    expect(mockUserRepository.softDelete).toBeCalled();
    expect(mockUserRepository.findOneBy).toBeCalledWith({ id });
  });
});
