import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email',
  })
  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  email: string;

  @ApiProperty({
    description: 'Contraseña de minimo 6 caracteres',
  })
  @IsString({
    message: 'La contraseña debe ser un string',
  })
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}
