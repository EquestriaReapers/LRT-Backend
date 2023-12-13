import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProfileDTO } from './create-profile.dto';
import { Career } from 'src/core/career/enum/career.enum';

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
  @IsEnum(Career, { message: 'Invalid Career' })
  @IsOptional()
  mainTitle: Career;

  @ApiProperty()
  @IsString()
  @IsOptional()
  countryResidence: string;
}
