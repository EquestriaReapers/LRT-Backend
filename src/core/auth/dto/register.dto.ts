import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Apellido',
  })
  @IsString({ message: 'El apellido debe ser un string' })
  @MinLength(1)
  lastname: string;

  @ApiProperty({
    description: 'Cedula de identidad',
  })
  @IsString({ message: 'La cedula debe ser un string' })
  @MinLength(2)
  documentNumber: string;

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
