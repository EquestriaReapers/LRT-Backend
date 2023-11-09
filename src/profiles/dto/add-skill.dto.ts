import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddSkillDto {
  
  @ApiProperty()
  @IsInt()
  skillId: number;
}