import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ExperienceCreateResponseDTO } from './create-experience.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExperienceDto extends PartialType(
  ExperienceCreateResponseDTO,
) {
  @ApiProperty({ example: 'Narrador de futbol en ESPN', required: true })
  @IsString({ message: 'El rol debe ser un string' })
  @IsOptional()
  role: string;

  @ApiProperty()
  @IsString({ message: 'El nombre de la empresa debe ser un string' })
  @IsOptional()
  businessName: string;

  @ApiProperty()
  @IsNumber({}, { message: 'El id del perfil debe ser un número' })
  @IsOptional()
  profileId: number;

  @ApiProperty()
  @IsString({ message: 'La ubicación debe ser un string' })
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString({ message: 'La descripción debe ser un string' })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '2021-01-01',
  })
  @IsDateString(
    {},
    {
      message:
        'La fecha de inicio debe ser una fecha válida ejemplo 2021-01-01',
    },
  )
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    example: '2021-01-02',
  })
  @IsDateString(
    {},
    { message: 'La fecha de fin debe ser una fecha válida ejemplo 2021-01-01' },
  )
  @IsOptional()
  endDate: Date;
}
