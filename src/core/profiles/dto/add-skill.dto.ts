import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddSkillDto {
  @ApiProperty()
  @IsInt({ message: 'El ID de la habilidad debe ser un número entero' })
  skillId: number;
}