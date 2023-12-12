import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ContactMethod {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @IsEmail()
  email: string;
}
