import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProfileDTO } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDTO) {
  @ApiProperty({ example: 'Muy proactivo', required: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mainTitle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  countryResidence: string;
}
