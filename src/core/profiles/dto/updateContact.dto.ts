import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { TypeContact } from 'src/constants';

export class UpdateContactMethodDto {
  @ApiProperty()
  @IsString()
  type: TypeContact;

  @ApiProperty()
  @IsString()
  value: string;
}
