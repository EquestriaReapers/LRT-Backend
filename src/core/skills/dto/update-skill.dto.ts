import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @ApiProperty({ example: 'React' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

}
