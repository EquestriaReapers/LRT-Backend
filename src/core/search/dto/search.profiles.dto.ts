import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SearchProfileDto {
  @ApiProperty({
    description: 'The name of the profiles that you want to search',
    example: 'Emma',
  })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The name of the profiles that you want to search',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills: string[];

  @ApiProperty({
    description: 'The name of the profiles that you want to search',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  career: string[];

  @ApiProperty({
    description: 'The name of the profiles that you want to search',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  countryResidence: string[];

  @ApiProperty({
    description: 'The name of the profiles that you want to search',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  language: string[];
}
