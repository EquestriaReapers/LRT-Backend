import { Injectable } from '@nestjs/common';
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';
import { InternalServerErrorException } from '@nestjs/common';
import { ERROR_UNKOWN_GENERATING_PDF } from '../messages';
import { Buffer } from 'buffer';

@Injectable()
export default class ProfileExportPDFAction {
  async execute(): Promise<Buffer> {
    try {
      const filePath = path.join(
        process.cwd(),
        'src',
        'templates',
        'pdf-profile.hbs',
      );
      return createPdf(filePath, {
        format: 'a4',
        printBackground: true,
        margin: {
          left: '0mm',
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(ERROR_UNKOWN_GENERATING_PDF);
    }
  }
}
