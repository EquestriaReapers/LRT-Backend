import { Test, TestingModule } from '@nestjs/testing';
import { SkillsController } from '../skills.controller';
import { SkillsService } from '../service/skills.service';
import { CreateSkillDto } from '../dto/create-skill.dto';
import { UpdateSkillDto } from '../dto/update-skill.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadService } from '../../common/service/jwt.payload.service';

const mockSkillsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('token'),
};

describe('SkillsController', () => {
  let controller: SkillsController;
  let service: SkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [
        {
          provide: SkillsService,
          useValue: mockSkillsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        JwtPayloadService,
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
    service = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new skill and return its data', async () => {
      // arrange
      const createSkillDto: CreateSkillDto = {
        name: 'JavaScript',
      };

      const expectedSkill = {
        id: 1,
        name: 'JavaScript',
      };

      mockSkillsService.create.mockResolvedValue(expectedSkill);

      // act
      const result = await controller.create(createSkillDto);

      // assert
      expect(mockSkillsService.create).toBeCalledWith(createSkillDto);
      expect(result).toEqual(expectedSkill);
    });
  });

  describe('findAll', () => {
    it('should return an array of skills', async () => {
      // arrange
      const expectedSkills = [
        { id: 1, name: 'JavaScript' },
        { id: 2, name: 'Python' },
      ];

      mockSkillsService.findAll.mockResolvedValue(expectedSkills);

      // act
      const result = await controller.findAll();

      // assert
      expect(mockSkillsService.findAll).toBeCalled();
      expect(result).toEqual(expectedSkills);
    });
  });

  describe('findOne', () => {
    it('should find a skill by a given id and return its data', async () => {
      // arrange
      const id = '1';
      const expectedSkill = { id: 1, name: 'JavaScript' };

      mockSkillsService.findOne.mockResolvedValue(expectedSkill);

      // act
      const result = await controller.findOne(id);

      // assert
      expect(mockSkillsService.findOne).toBeCalledWith(+id);
      expect(result).toEqual(expectedSkill);
    });
  });

  describe('update', () => {
    it('should update a skill by a given id and return its updated data', async () => {
      // arrange
      const id = '1';
      const updateSkillDto: UpdateSkillDto = { name: 'TypeScript' };
      const expectedSkill = { id: 1, name: 'TypeScript' };

      mockSkillsService.update.mockResolvedValue(expectedSkill);

      // act
      const result = await controller.update(id, updateSkillDto);

      // assert
      expect(mockSkillsService.update).toBeCalledWith(+id, updateSkillDto);
      expect(result).toEqual(expectedSkill);
    });
  });

  describe('remove', () => {
    it('should remove a skill by a given id and return the removed skill', async () => {
      // arrange
      const id = '1';
      const expectedSkill = { id: 1, name: 'JavaScript' };

      mockSkillsService.remove.mockResolvedValue(expectedSkill);

      // act
      const result = await controller.remove(id);

      // assert
      expect(mockSkillsService.remove).toBeCalledWith(+id);
      expect(result).toEqual(expectedSkill);
    });
  });
});
