import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Nombre',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Apellido',
  })
  @IsString()
  @MinLength(1)
  lastname: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  documentNumber: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña de minimo 6 caracteres',
  })
  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}
