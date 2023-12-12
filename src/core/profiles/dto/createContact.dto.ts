import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { TypeContact } from 'src/constants';

export class CreateContactDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
