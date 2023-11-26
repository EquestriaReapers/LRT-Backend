import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateProfileDTO } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDTO) {
  @ApiProperty({ example: 'Muy proactivo', required: true })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ type: 'file' })
  file: Express.Multer.File;
}
