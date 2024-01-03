import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CleanBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    // Eliminar propiedades vacías del cuerpo
    for (const propName in body) {
      if (
        body[propName] === '' ||
        body[propName] === null ||
        body[propName] === undefined
      ) {
        delete body[propName];
      }
    }

    // Eliminar propiedades vacías de los archivos
    const files = req.files;
    if (files) {
      for (const filePropName in files) {
        const file = files[filePropName];
        if (file instanceof Array && file.length === 0) {
          delete files[filePropName];
        }
      }
    }

    next();
  }
}
