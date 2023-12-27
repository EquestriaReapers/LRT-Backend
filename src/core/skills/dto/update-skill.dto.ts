import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export enum SkillType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}
export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @ApiProperty({ example: 'React' })
  @IsOptional()
  name: string;

  @ApiProperty({ enum: SkillType, example: SkillType.HARD, required: true })
  @IsEnum(SkillType, { message: 'El tipo de habilidad debe ser HARD o SOFT' })
  @IsNotEmpty()
  type: SkillType;
}
