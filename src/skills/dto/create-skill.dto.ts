import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'React', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
