import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SearchProfileDto {
  @ApiProperty({
    description: 'The name of the profiles that you want to search',
    example: 'Emma',
  })
  @IsOptional()
  @IsString()
  text: string;
}
