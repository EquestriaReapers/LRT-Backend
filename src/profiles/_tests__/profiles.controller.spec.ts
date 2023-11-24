import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import 'dotenv/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { JwtPayloadService } from '../../common/service/jwt.payload.service';
import { UserRole } from '../../constants';
import { ProfilesController } from '../profiles.controller';
import { ProfilesService } from '../service/profiles.service';
import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';

const expectProfile = [
  {
    userId: 1,
    description: 'default',
    deletedAt: null,
    user: {
      name: 'Chadwick',
      email: 'chadwickboseman@email.com',
    },
    skills: [
      {
        id: 1,
        name: 'Angular',
      },
      {
        id: 2,
        name: 'React',
      },
    ],
    experience: [
      {
        id: 1,
        profileId: 1,
        urlProyecto: 'https://github.com',
        cargo: 'Software developer',
        descripcion: 'I am a software developer',
        nombreProyecto: 'Github',
      },
    ],
  },
];

const mockUserRepository = {
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOneByEmail: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockProfileRepository = {
  save: jest.fn(),
  find: jest.fn().mockResolvedValue(expectProfile),
  findOne: jest.fn(),
  updateMyProfile: jest.fn(),
  addSkillProfile: jest.fn(),
  removeSkillProfile: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'),
};

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: process.env.JWT_SECRET })], // Asegúrate de reemplazar 'secret' con tu clave secreta real
      controllers: [ProfilesController],
      // If you've looked at the complex sample you'll notice that these functions
      // are a little bit more in depth using mock implementation
      // to give us a little bit more control and flexibility in our tests
      // this is not necessary, but can sometimes be helpful in a test scenario
      providers: [
        ProfilesService,
        {
          provide: getRepositoryToken(Profile),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(Skill),
          useValue: mockProfileRepository,
        },
        JwtPayloadService,
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll => Should return an array of profiles', async () => {
    // arrange

    jest.spyOn(mockUserRepository, 'find').mockReturnValue(expectProfile);

    //act
    const result = await service.findAll();

    expect(result).toEqual(expectProfile);
    expect(mockProfileRepository.find).toBeCalled();
  });

  it('findOne => Should return a profile', async () => {
    // arrange
    const id = 1;

    jest.spyOn(mockProfileRepository, 'findOne').mockReturnValue(expectProfile);

    // act
    const result = await service.findOne(id);

    expect(result).toEqual(expectProfile);
    expect(mockProfileRepository.findOne).toBeCalled();
    expect(mockProfileRepository.findOne).toBeCalledWith({
      where: { userId: id },
      relations: { user: true, skills: true, experience: true },
      select: { user: { name: true, email: true } },
    });
  });

  it('updateMyProfile => Should update a profile', async () => {
    // arrange
    const updateProfileDto = {
      name: 'Chadwick',
      description: 'updated',
    };

    const user = {
      id: 1,
      name: 'Chadwick',
      email: 'chadwickboseman@email.com',
      role: UserRole.ADMIN,
    };

    const expectedProfile = {
      userId: 1,
      description: 'updated',
    };

    jest.spyOn(mockUserRepository, 'update').mockReturnValue({ affected: 1 });
    jest
      .spyOn(mockProfileRepository, 'update')
      .mockReturnValue(expectedProfile);

    // act
    const result = await service.updateMyProfile(updateProfileDto, user);

    // assert
    expect(result).toEqual(expectedProfile);
    expect(mockUserRepository.update).toBeCalled();
    expect(mockUserRepository.update).toBeCalledWith(user.id, {
      name: updateProfileDto.name,
    });
    expect(mockProfileRepository.update).toBeCalled();
    expect(mockProfileRepository.update).toBeCalledWith(user.id, {
      description: updateProfileDto.description,
    });
  });

  it('remove => Should remove a profile', async () => {
    // arrange
    const id = 1;

    jest.spyOn(mockProfileRepository, 'softDelete').mockReturnValue({
      affected: 1,
    });

    // act
    const result = await service.remove(id);

    // assert
    expect(result).toEqual({ affected: 1 });
    expect(mockProfileRepository.softDelete).toBeCalled();
    expect(mockProfileRepository.softDelete).toBeCalledWith(id);
  });

  it('addSkillProfile => Should add a skill to a profile', async () => {
    // arrange
    const id = 1;
    const skillId = 1;

    const expectedProfile = {
      userId: 1,
      description: 'default',
      deletedAt: null,
      user: {
        name: 'Chadwick',
        email: '',
      },
    };
  });
});
