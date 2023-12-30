import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Career } from 'src/core/career/enum/career.enum';

export class CreateProfileDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  description: string;

  @ApiProperty()
  @IsEnum(Career, { message: 'Carrera inválida' })
  @IsNotEmpty({ message: 'La carrera principal no puede estar vacía' })
  mainTitle: Career;

  @ApiProperty()
  @IsNotEmpty({ message: 'El país de residencia no puede estar vacío' })
  @IsString({ message: 'El país de residencia debe ser una cadena de texto' })
  countryResidence: string;
}
