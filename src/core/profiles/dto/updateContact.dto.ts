import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { TypeContact } from 'src/constants';

export class UpdateContactMethodDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;
}
