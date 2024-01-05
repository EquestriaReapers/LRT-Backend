import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'El token para el restablecimiento de la contraseña',
    type: String,
  })
  @IsString({ message: 'El token debe ser una cadena de texto' })
  token: string;

  @ApiProperty({
    description: 'La nueva contraseña',
    type: String,
  })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  newPassword: string;
}