import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePortfolioDto } from '../dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '../dto/update-portfolio.dto';
import { UserActiveInterface } from 'src/common/interface/user-active-interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from '../entities/portfolio.entity';
import { Repository } from 'typeorm';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import { PROFILE_NOT_FOUND } from 'src/core/profiles/messages';
import { envData } from 'src/config/datasource';
import { ERROR_PORTFOLIO_NOT_FOUND } from '../message';
import { URL } from 'url';
import { deleteFile } from 'src/common/utils/create file-upload-util';
@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(
    createPortfolioDto: CreatePortfolioDto,
    user: UserActiveInterface,
  ) {
    const profile = await this.profileRepository.findOne({
      where: { userId: user.id },
    });

    if (!profile) {
      throw new Error(PROFILE_NOT_FOUND);
    }

    let newPathPrincipal = null;
    if (
      createPortfolioDto.imagePrincipal &&
      createPortfolioDto.imagePrincipal[0].path
    ) {
      const path = createPortfolioDto.imagePrincipal[0].path;
      newPathPrincipal =
        envData.BACKEND_BASE_URL + '/' + path.replace(/\\/g, '/');
    }

    let newPaths = [];
    if (createPortfolioDto.image) {
      for (const file of createPortfolioDto.image) {
        if (file.path) {
          const newPath =
            envData.BACKEND_BASE_URL + '/' + file.path.replace(/\\/g, '/');
          newPaths.push(newPath);
        }
      }
    }

    const newPortfolio = await this.portfolioRepository.save({
      title: createPortfolioDto.title,
      description: createPortfolioDto.description,
      location: createPortfolioDto.location,
      dateEnd: createPortfolioDto.dateEnd,
      profileId: user.id,
      imagePrincipal: newPathPrincipal,
      image: newPaths,
    });

    return newPortfolio;
  }

  async findAll(profileId: number) {
    return await this.portfolioRepository.find({
      where: {
        profileId,
      },
    });
  }

  async findOne(id: number) {
    return await this.portfolioRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    updatePortfolioDto: UpdatePortfolioDto,
    user: UserActiveInterface,
  ): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, profileId: user.id },
    });

    if (!portfolio) {
      throw new BadRequestException(ERROR_PORTFOLIO_NOT_FOUND);
    }

    let newPathPrincipal = null;
    if (
      updatePortfolioDto.imagePrincipal &&
      updatePortfolioDto.imagePrincipal[0].path
    ) {
      const path = updatePortfolioDto.imagePrincipal[0].path;
      newPathPrincipal =
        envData.BACKEND_BASE_URL + '/' + path.replace(/\\/g, '/');
    }

    let newPaths = [];
    if (updatePortfolioDto.image) {
      for (const file of updatePortfolioDto.image) {
        if (file.path) {
          const newPath =
            envData.BACKEND_BASE_URL + '/' + file.path.replace(/\\/g, '/');
          newPaths.push(newPath);
        }
      }
    }

    const url = new URL(portfolio.imagePrincipal);
    let filePathPrincipal = url.pathname;
    if (filePathPrincipal.startsWith('/')) {
      filePathPrincipal = filePathPrincipal.substring(1);
    }
    await deleteFile(filePathPrincipal, portfolio.imagePrincipal);

    if (portfolio.image && portfolio.image.length > 0) {
      for (const imagePath of portfolio.image) {
        const imageUrl = new URL(imagePath);
        let filePath = imageUrl.pathname;
        if (filePath.startsWith('/')) {
          filePath = filePath.substring(1);
        }
        await deleteFile(filePath, imagePath);
      }
    }

    await this.portfolioRepository.save({
      id,
      title: updatePortfolioDto.title,
      description: updatePortfolioDto.description,
      location: updatePortfolioDto.location,
      dateEnd: updatePortfolioDto.dateEnd,
      imagePrincipal: newPathPrincipal,
      image: newPaths,
    });

    return;
  }

  async remove(id: number, user: UserActiveInterface): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, profileId: user.id },
    });

    if (!portfolio) {
      throw new BadRequestException(ERROR_PORTFOLIO_NOT_FOUND);
    }

    const url = new URL(portfolio.imagePrincipal);
    let filePathPrincipal = url.pathname;
    if (filePathPrincipal.startsWith('/')) {
      filePathPrincipal = filePathPrincipal.substring(1);
    }
    await deleteFile(filePathPrincipal, portfolio.imagePrincipal);

    if (portfolio.image && portfolio.image.length > 0) {
      for (const imagePath of portfolio.image) {
        const imageUrl = new URL(imagePath);
        let filePath = imageUrl.pathname;
        if (filePath.startsWith('/')) {
          filePath = filePath.substring(1);
        }
        await deleteFile(filePath, imagePath);
      }
    }

    await this.portfolioRepository.delete(id);

    return;
  }
}
