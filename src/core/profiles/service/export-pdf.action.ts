import { Injectable } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_UNKOWN_GENERATING_PDF } from '../messages';
import { Buffer } from 'buffer';
import handlebars from 'handlebars';
import * as fs from 'fs';

const FILE_CONFIG = {
  format: 'a4',
  printBackground: true,
  margin: { left: '0mm', top: '0mm', right: '0mm', bottom: '0mm' },
};

@Injectable()
export default class ProfileExportPDFAction {
  async execute(): Promise<Buffer> {
    try {
      const filePath = this.getTemplatePath();
      await this.registerPartial('listItemIcon', 'list-item-icon.hbs');
      await this.registerPartial('icon', 'icon.hbs');
      await this.registerPartial('header', 'header.hbs');
      await this.registerPartial('experiencieItem', 'experiencie-item.hbs');
      await this.registerPartial('educationItem', 'education-item.hbs');

      return createPdf(filePath, FILE_CONFIG);
    } catch (error) {
      throw new InternalServerErrorException(ERROR_UNKOWN_GENERATING_PDF);
    }
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
