import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdatePortafolioDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  titulo: string;

  @ApiProperty()
  @IsOptional()
  @IsDate({ message: 'La fecha de finalización debe ser una fecha válida' })
  fechaFinalizacion: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  ubicacion: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'La imagen debe ser una cadena de texto' })
  imagen: string;
}