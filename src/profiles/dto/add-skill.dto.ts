import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class AddSkillDto {
  
  @ApiProperty()
  @IsInt()
  skillId: number;

  @ApiProperty()
  @IsBoolean()
  remove: boolean;
}