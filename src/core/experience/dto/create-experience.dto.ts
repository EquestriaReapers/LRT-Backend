import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ExperienceCreateResponseDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsString({ message: 'El rol debe ser un string' })
  role: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre de la empresa es requerido' })
  @IsString({ message: 'El nombre de la empresa debe ser un string' })
  businessName: string;

  @ApiProperty()
  @IsNumber({}, { message: 'El id del perfil debe ser un número' })
  @IsOptional()
  profileId: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre del perfil es requerido' })
  @IsDateString(
    {},
    {
      message:
        'La fecha de inicio debe ser una fecha válida ejemplo 2021-01-01',
    },
  )
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'La ubicación es requerida' })
  @IsString({ message: 'La ubicación debe ser un string' })
  location: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser un string' })
  description: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'La fecha de fin debe ser una fecha válida ejemplo 2021-01-01' },
  )
  endDate: Date;
}
