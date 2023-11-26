import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'React', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '10', required: true })
  @IsNumber()
  @IsNotEmpty()
  level: number;
}
