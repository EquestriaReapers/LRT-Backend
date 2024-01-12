import { Injectable } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_UNKOWN_GENERATING_PDF } from '../../messages';
import { Buffer } from 'buffer';
import handlebars from 'handlebars';
import * as fs from 'fs';
import ProfileTemplateAdaptator from './profile-template-adapter.class';
import { Profile } from '../../entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseProfileGet } from '../../dto/responses.dto';

const FILE_CONFIG = {
  format: 'a4',
  printBackground: true,
  margin: { left: '0mm', top: '10mm', right: '0mm', bottom: '10mm' },
};

@Injectable()
export default class ProfileExportPDFAction {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly profileTemplateAdaptator: ProfileTemplateAdaptator,
  ) {}

  async execute(id: number): Promise<Buffer> {
    try {
      const filePath = this.getTemplatePath();
      await this.registerPartial('header', 'header.hbs');
      // Register Components
      await this.registerPartial('listItemIcon', 'list-item-icon.hbs');
      await this.registerPartial('icon', 'icon.hbs');
      // Register Items
      await this.registerPartial('experiencieItem', 'experiencie-item.hbs');
      await this.registerPartial('educationItem', 'education-item.hbs');
      // Register Sections
      await this.registerPartial('educationSection', 'education-section.hbs');
      await this.registerPartial(
        'experiencieSection',
        'experiencie-section.hbs',
      );
      await this.registerPartial('skillsSection', 'skills-section.hbs');
      await this.registerPartial('languagesSection', 'lenguagues-section.hbs');

      handlebars.registerHelper('is-not-empty', function (a) {
        if (Array.isArray(a) && a.length > 0) return true;
        return a !== null && a !== undefined && a !== '';
      });

      const profileOriginData = await this.getProfileOriginDataById(id);
      const profileData =
        await this.profileTemplateAdaptator.execute(profileOriginData);

      return createPdf(filePath, FILE_CONFIG, { ...profileData });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ERROR_UNKOWN_GENERATING_PDF);
    }
  }

  private async getProfileOriginDataById(
    userId: number,
  ): Promise<ResponseProfileGet> {
    const profile = await this.profileRepository.findOne({
      where: {
        userId: userId,
        skillsProfile: {
          isVisible: true,
        },
        languageProfile: {
          isVisible: true,
        },
        experience: {
          isVisible: true,
        },
        education: {
          isVisible: true,
        },
      },
      relations: [
        'user',
        'skillsProfile',
        'skillsProfile.skill',
        'experience',
        'education',
        'languageProfile',
        'languageProfile.language',
      ],
      select: {
        user: {
          name: true,
          lastname: true,
          email: true,
        },
      },
      order: {
        experience: {
          startDate: 'DESC',
        },
        education: {
          endDate: 'DESC',
        },
      },
    });

    const { skillsProfile, languageProfile, ...otherProfileProps } = profile;

    const mappedProfile = {
      ...otherProfileProps,
      skills: skillsProfile.map(({ skill, ...sp }) => ({
        id: skill.id,
        name: skill.name,
        type: skill.type,
        skillProfileId: sp.id,
        isVisible: sp.isVisible,
      })),
      languages: languageProfile.map(({ language, ...lp }) => ({
        ...lp,
        name: language.name,
      })),
    };

    return mappedProfile;
  }

  private getTemplatePath() {
    const filePath = path.join(
      process.cwd(),
      'src',
      'templates',
      'pdf-profile',
      'index.hbs',
    );
    return filePath;
  }

  private async registerPartial(partialName: string, partialFileName: string) {
    const partialPath = path.join(
      process.cwd(),
      'src',
      'templates',
      'pdf-profile',
      'partials',
      partialFileName,
    );
    const partialTemplate = await fs.readFileSync(partialPath, 'utf8');
    handlebars.registerPartial(partialName, partialTemplate);
  }
}
