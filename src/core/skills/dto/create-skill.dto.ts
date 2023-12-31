import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SkillType } from '../entities/skill.entity';

export class CreateSkillDto {
  @ApiProperty({ example: 'React', required: true })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: SkillType, example: SkillType.HARD, required: true })
  @IsEnum(SkillType, { message: 'El tipo de habilidad debe ser HARD o SOFT' })
  @IsOptional()
  type: SkillType;
}
