import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLanguageDto {
  @ApiProperty({ example: 'Mandarin', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
