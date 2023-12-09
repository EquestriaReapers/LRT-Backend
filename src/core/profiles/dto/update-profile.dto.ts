import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProfileDTO } from './create-profile.dto';
import { Carrera } from 'src/core/career/enum/career.enum';

export class UpdateProfileDto extends PartialType(CreateProfileDTO) {
  @ApiProperty({ example: 'Muy proactivo', required: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mainTitle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  countryResidence: string;

  @ApiProperty()
  @IsEnum(Carrera, { message: 'Invalid Career' })
  @IsOptional()
  career: Carrera;
}
