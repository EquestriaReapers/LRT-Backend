import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateProfileDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  mainTitle: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El país de residencia no puede estar vacío' })
  @IsString({ message: 'El país de residencia debe ser una cadena de texto' })
  countryResidence: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El sitio web no puede estar vacío' })
  @IsString({ message: 'El sitio web debe ser una cadena de texto' })
  website: string;
}
