import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './create-experience.dto';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {
  @ApiProperty({ example: 'Narrador de futbol en ESPN', required: true })
  @IsString()
  @IsOptional()
  role: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  profileId: number;

  @ApiProperty({ type: 'file' })
  file: Express.Multer.File;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  endDate: Date;
}
