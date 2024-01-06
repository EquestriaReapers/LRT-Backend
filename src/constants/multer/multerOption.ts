import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException('Solo se permite subir imagenes'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

export function validateImageFile(req, res, next) {
  if (req.file && !req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return res.status(400).json({ message: 'Solo se permite subir imagenes' });
  }
  next();
}
