import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageDto } from './create-language.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @ApiProperty({ example: 'Mandarin' })
  @IsOptional()
  name: string;

  @ApiProperty({ example: '10' })
  @IsNumber()
  @IsNotEmpty()
  level: number;
}
