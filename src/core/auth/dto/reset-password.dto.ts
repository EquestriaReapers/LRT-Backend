import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'La nueva contraseña',
    type: String,
  })
  @IsString({ message: 'La nueva contraseña debe ser una cadena de texto' })
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  newPassword: string;
}
