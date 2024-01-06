import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { UpdateLanguageDto } from '../dto/update-language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Language } from '../entities/language.entity';
import { ERROR_LANGUAGE_NOT_FOUND } from '../messages';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    return await this.languageRepository.save(createLanguageDto);
  }

  async findAll(name?: string): Promise<Language[]> {
    const queryOptions: any = {};

    if (name) {
      queryOptions.where = {
        name: ILike(`%${name}%`),
      };
    }

    return this.languageRepository.find(queryOptions);
  }

  async findOne(id: number): Promise<Language> {
    const language = await this.languageRepository.findOne({ where: { id } });
    if (!language) {
      throw new NotFoundException(ERROR_LANGUAGE_NOT_FOUND);
    }
    return language;
  }

  async update(
    id: number,
    updateLanguageDto: UpdateLanguageDto,
  ): Promise<Language> {
    const language = await this.languageRepository.preload({
      id,
      ...updateLanguageDto,
    });
    if (!language) {
      throw new NotFoundException(ERROR_LANGUAGE_NOT_FOUND);
    }
    return this.languageRepository.save(language);
  }

  async remove(id: number): Promise<void> {
    const language = await this.findOne(id);
    await this.languageRepository.remove(language);
  }
}
