import { Injectable } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_UNKOWN_GENERATING_PDF } from '../../messages';
import { Buffer } from 'buffer';
import handlebars from 'handlebars';
import * as fs from 'fs';
import { getDummyProfileTemplate } from './fixtures';
import { SkillSetType } from './types';
import ProfileTemplateAdaptator from './profile-template-adapter.class';
import { Profile } from '../../entities/profile.entity';

const FILE_CONFIG = {
  format: 'a4',
  printBackground: true,
  margin: { left: '0mm', top: '0mm', right: '0mm', bottom: '10mm' },
};

@Injectable()
export default class ProfileExportPDFAction {
  constructor(
    private readonly profileTemplateAdaptator: ProfileTemplateAdaptator,
  ) {}

  async execute(): Promise<Buffer> {
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
      await this.registerPartial('lenguaguesSection', 'lenguagues-section.hbs');

      handlebars.registerHelper('is-not-empty', function (a) {
        if (Array.isArray(a) && a.length > 0) return true;
        return a !== null && a !== undefined && a !== '';
      });

      const profileOriginData = await this.getProfileOriginDataById(1);
      const profileData =
        this.profileTemplateAdaptator.execute(profileOriginData);

      // Sustituir getDummyProfileTemplate con profileData cuando este listo.
      return createPdf(filePath, FILE_CONFIG, {
        ...getDummyProfileTemplate(SkillSetType.HardSoft),
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ERROR_UNKOWN_GENERATING_PDF);
    }
  }

  private async getProfileOriginDataById(userId: number): Promise<Profile> {
    userId;
    return {} as any;
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
