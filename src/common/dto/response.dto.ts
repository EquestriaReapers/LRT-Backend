import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'No puede estar vacío' })
  @IsString({ message: 'Debe ser una cadena de texto' })
  message: string;
}
