import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ExperienceCreateResponseDTO } from './create-experience.dto';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExperienceDto extends PartialType(
  ExperienceCreateResponseDTO,
) {
  @ApiProperty({ example: 'Narrador de futbol en ESPN', required: true })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  businessName: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  profileId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2021-01-02',
  })
  @IsOptional()
  @IsDateString()
  endDate: Date;
}
