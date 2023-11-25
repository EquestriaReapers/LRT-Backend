import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
    @ApiProperty({ example: 'React' })
    @IsOptional()
    name: string;

    @ApiProperty({ example: '10' })
    @IsNumber()
    @IsNotEmpty()
    level: number;
}
