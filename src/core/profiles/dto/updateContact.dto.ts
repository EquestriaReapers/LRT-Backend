import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { TypeContact } from 'src/constants';

export class UpdateContactMethodDto {
  @ApiProperty()
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsOptional()
  email: string;
}