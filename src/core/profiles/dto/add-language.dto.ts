import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AddLanguageDto {
  @ApiProperty()
  @IsInt()
  languageId: number;

  @ApiProperty()
  @IsString()
  level: string;
}
