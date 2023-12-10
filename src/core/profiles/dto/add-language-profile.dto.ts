import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AddLanguageProfileDto {
  @ApiProperty()
  @IsInt()
  languageId: number;

  @ApiProperty()
  @IsString()
  level: string;
}
