import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  message: string;
}
