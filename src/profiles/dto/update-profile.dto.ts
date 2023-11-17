import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateProfileDTO } from './create-profile.dto';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto extends PartialType(CreateProfileDTO){
    @ApiProperty({ example: 'Muy proactivo', required: true })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsOptional()
    name: string;
}
