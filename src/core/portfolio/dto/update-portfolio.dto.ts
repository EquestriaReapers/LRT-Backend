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
  @ApiProperty({
    required: false,
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsDateString(
    {},
    {
      message:
        'La fecha de finalización debe ser una fecha válida ejem 2023-02-01',
    },
  )
  @IsOptional()
  dateEnd: Date;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @IsOptional()
  location: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
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
