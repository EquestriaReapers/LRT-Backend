import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateProfileDTO } from './create-profile.dto';
import { Career } from 'src/core/career/enum/career.enum';

export class UpdateProfileDto extends PartialType(CreateProfileDTO) {
  @ApiProperty({ example: 'Muy proactivo', required: true })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsString({ message: 'El país de residencia debe ser una cadena de texto' })
  @IsOptional()
  countryResidence: string;

  @ApiProperty()
  @IsString({ message: 'El sitio web debe ser una cadena de texto' })
  @IsOptional()
  website: string;
}
