import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiFile, ApiFiles } from 'src/common/class/customClassMulter';

export class CreatePortfolioDto {
  @ApiProperty()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  title: string;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message:
        'La fecha de finalización debe ser una fecha válida ejem 2023-02-01',
    },
  )
  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  dateEnd: Date;

  @ApiProperty()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  location: string;

  @ApiProperty()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  description: string;

  @ApiFiles({ required: false })
  @IsOptional()
  image: Express.Multer.File[];

  @ApiFile({ required: false })
  @IsOptional()
  imagePrincipal: Express.Multer.File;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La URL debe ser una cadena de texto' })
  url: string;
}
