import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SkillType } from '../entities/skill.entity';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @ApiProperty({ example: 'React' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  name: string;

  @ApiProperty({ enum: SkillType, example: SkillType.HARD, required: true })
  @IsEnum(SkillType, { message: 'El tipo de habilidad debe ser HARD o SOFT' })
  @IsOptional()
  type: SkillType;
}
