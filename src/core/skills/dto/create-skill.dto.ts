import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'React', required: true })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty()
  name: string;

}
