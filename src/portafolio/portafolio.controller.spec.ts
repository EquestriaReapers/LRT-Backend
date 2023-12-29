import { Test, TestingModule } from '@nestjs/testing';
import { PortafolioController } from './portafolio.controller';
import { PortafolioService } from './service/portafolio.service';

describe('PortafolioController', () => {
  let controller: PortafolioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortafolioController],
      providers: [PortafolioService],
    }).compile();

    controller = module.get<PortafolioController>(PortafolioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
