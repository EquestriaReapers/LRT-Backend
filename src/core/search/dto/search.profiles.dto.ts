import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class SearchProfileDto {
  @ApiProperty({
    description: 'The name of the profiles that you want to search',
    example: 'Emma',
  })
  @IsNotEmpty()
  @Length(2, 255)
  text: string;
}
