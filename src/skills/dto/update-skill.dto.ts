import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';
import { IsOptional } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
    @ApiProperty({ example: 'React' })
    @IsOptional()
    name: string;
}