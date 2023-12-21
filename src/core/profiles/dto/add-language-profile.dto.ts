import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { Language } from 'src/core/language/entities/language.entity';
import { LanguageLevel } from '../entities/language-profile.entity';

export class AddLanguageProfileDto {
  @ApiProperty()
  @IsInt()
  languageId: number;

  @ApiProperty({ enum: LanguageLevel })
  @IsEnum(LanguageLevel)
  level: LanguageLevel;
}
