import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

export class CreatePortafolioDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  titulo: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La fecha de finalización es obligatoria' })
  @IsDate({ message: 'La fecha de finalización debe ser una fecha válida' })
  fechaFinalizacion: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  ubicacion: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  imagen: string;
}