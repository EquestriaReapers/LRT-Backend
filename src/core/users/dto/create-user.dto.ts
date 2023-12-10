import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../constants';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John', required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'V30109748' })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({ example: 'Winchester' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'ronaldo@gmail.com', required: true })
  @IsNotEmpty()
  @isUniqueDb({
    table: 'user',
    column: 'email',
    message: 'El correo ya existe',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', required: true })
  @IsNotEmpty()
  @MinLength(6)
  @IsString()
  @Transform(({ value }) => value.trim())
  password: string;

  @ApiProperty({ example: 'admin|graduate', required: true })
  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role: UserRole;
}
