import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TypeContact } from 'src/constants';

export class CreateContactDto {
  @ApiProperty({
    enum: TypeContact,
    example: TypeContact.EMAIL,
  })
  @IsString()
  @IsNotEmpty()
  type: TypeContact;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}
