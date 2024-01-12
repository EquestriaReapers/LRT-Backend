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
import { ERROR_IMAGE_NOT_FOUND, ERROR_PORTFOLIO_NOT_FOUND } from '../message';
import { URL } from 'url';
import { deleteFile } from 'src/common/utils/create file-upload-util';
import { UserProfileCacheUpdater } from 'src/core/search/service/user-profile-cache-updater.class';
@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    private readonly userProfileCacheUpdater: UserProfileCacheUpdater,
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
      url: createPortfolioDto.url,
    });

    await this.userProfileCacheUpdater.updatePortfolioOneProfile(user.id);

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
    let newPaths = [];
    let newPathPrincipal = null;

    if (!portfolio) {
      throw new BadRequestException(ERROR_PORTFOLIO_NOT_FOUND);
    }

    if (!updatePortfolioDto.hasOwnProperty('imagePrincipal')) {
      newPathPrincipal = portfolio.imagePrincipal;
    }
    if (!updatePortfolioDto.hasOwnProperty('image')) {
      newPaths = portfolio.image;
    }

    if (
      updatePortfolioDto.imagePrincipal &&
      updatePortfolioDto.imagePrincipal[0].path &&
      updatePortfolioDto.imagePrincipal !== null &&
      updatePortfolioDto.imagePrincipal !== undefined
    ) {
      const path = updatePortfolioDto.imagePrincipal[0].path;
      newPathPrincipal =
        envData.BACKEND_BASE_URL + '/' + path.replace(/\\/g, '/');

      if (portfolio.imagePrincipal && portfolio.imagePrincipal.length > 0) {
        const url = new URL(portfolio.imagePrincipal);
        let filePathPrincipal = url.pathname;
        if (filePathPrincipal.startsWith('/')) {
          filePathPrincipal = filePathPrincipal.substring(1);
        }
        await deleteFile(filePathPrincipal, portfolio.imagePrincipal);
      }
    }

    if (updatePortfolioDto.image && updatePortfolioDto.image.length > 0) {
      newPaths = await this.addImage(updatePortfolioDto, portfolio);
    }

    await this.portfolioRepository.save({
      id,
      title: updatePortfolioDto.title,
      description: updatePortfolioDto.description,
      location: updatePortfolioDto.location,
      dateEnd: updatePortfolioDto.dateEnd,
      imagePrincipal: newPathPrincipal,
      image: newPaths,
      url: updatePortfolioDto.url,
    });

    await this.userProfileCacheUpdater.updatePortfolioOneProfile(user.id);

    return;
  }

  async addImage(updatePortfolioDto, portfolio: Portfolio) {
    let newPaths = [];
    let arrayImagePortofolio = portfolio.image;

    if (updatePortfolioDto.image) {
      for (const file of updatePortfolioDto.image) {
        if (file.path) {
          const newPath =
            envData.BACKEND_BASE_URL + '/' + file.path.replace(/\\/g, '/');
          newPaths.push(newPath);
        }
      }

      if (arrayImagePortofolio && arrayImagePortofolio.length > 2) {
        throw new BadRequestException(
          'Solo se pueden agregar 3 imagenes por proyecto',
        );
      } else {
        arrayImagePortofolio.push(...newPaths);
      }
    } else {
      throw new BadRequestException('No se ha enviado ninguna imagen');
    }

    return arrayImagePortofolio;
  }

  async removeImage(
    id: number,
    index: number,
    user: UserActiveInterface,
  ): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, profileId: user.id },
    });

    if (!portfolio) {
      throw new BadRequestException(ERROR_PORTFOLIO_NOT_FOUND);
    }

    if (portfolio.image && portfolio.image.length > 0) {
      if (
        !portfolio.image[index] ||
        portfolio.image[index] === null ||
        portfolio.image[index] === undefined
      ) {
        throw new BadRequestException(ERROR_IMAGE_NOT_FOUND);
      }

      const imageUrl = new URL(portfolio.image[index]);
      let filePath = imageUrl.pathname;
      if (filePath.startsWith('/')) {
        filePath = filePath.substring(1);
      }
      await deleteFile(filePath, portfolio.image[index]);
    }

    portfolio.image.splice(index, 1);

    await this.portfolioRepository.save({
      id,
      image: portfolio.image,
    });

    await this.userProfileCacheUpdater.updatePortfolioOneProfile(user.id);
  }

  async remove(id: number, user: UserActiveInterface): Promise<void> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, profileId: user.id },
    });

    if (!portfolio) {
      throw new BadRequestException(ERROR_PORTFOLIO_NOT_FOUND);
    }

    if (portfolio.imagePrincipal && portfolio.imagePrincipal.length > 0) {
      const url = new URL(portfolio.imagePrincipal);
      let filePathPrincipal = url.pathname;
      if (filePathPrincipal.startsWith('/')) {
        filePathPrincipal = filePathPrincipal.substring(1);
      }
      await deleteFile(filePathPrincipal, portfolio.imagePrincipal);
    }

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
    await this.userProfileCacheUpdater.updatePortfolioOneProfile(user.id);

    return;
  }
}
