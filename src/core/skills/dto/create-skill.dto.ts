import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export enum SkillType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}
export class CreateSkillDto {
  @ApiProperty({ example: 'React', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: SkillType, example: SkillType.HARD, required: true })
  @IsEnum(SkillType, { message: 'El tipo de habilidad debe ser HARD o SOFT' })
  @IsNotEmpty()
  type: SkillType;
}
