import { PartialType } from '@nestjs/mapped-types';
import { CreatePortfolioDto } from './create-portfolio.dto';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiFile, ApiFiles } from 'src/common/class/customClassMulter';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString(
    {},
    {
      message:
        'La fecha de finalización debe ser una fecha válida ejem 2023-02-01',
    },
  )
  dateEnd: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  location: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @ApiFiles({ required: false })
  @IsOptional()
  image: Express.Multer.File[];

  @ApiFile({ required: false })
  @IsOptional()
  imagePrincipal: Express.Multer.File;
}
