import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt } from 'class-validator';
import { LanguageLevel } from '../entities/language-profile.entity';

export class AddLanguageProfileDto {
  @ApiProperty()
  @IsInt({ message: 'El ID del idioma debe ser un número entero' })
  languageId: number;

  @ApiProperty({ enum: LanguageLevel })
  @IsEnum(LanguageLevel, { message: 'Nivel de idioma inválido' })
  level: LanguageLevel;
}