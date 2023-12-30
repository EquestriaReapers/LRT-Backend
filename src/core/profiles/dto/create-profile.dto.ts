import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Career } from 'src/core/career/enum/career.enum';

export class CreateProfileDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(Career, { message: 'Invalid Career' })
  @IsNotEmpty()
  mainTitle: Career;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  countryResidence: string;
}
