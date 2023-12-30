import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../../../constants';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string' })
  name: string;

  @ApiProperty({ example: 'V30109748' })
  @IsOptional()
  @IsString({ message: 'El número de documento debe ser un string' })
  @isUniqueDb({
    table: 'user',
    column: 'documentNumber',
    message: 'El número de documento ya existe',
  })
  documentNumber: string;

  @ApiProperty({ example: 'Winchester' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser un string' })
  lastname: string;

  @ApiProperty({ example: 'ronaldo@gmail.com' })
  @isUniqueDb({
    table: 'user',
    column: 'email',
    message: 'Correo ya existe',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  @IsOptional()
  @Transform(({ value }) => value.trim())
  password: string;

  @ApiProperty({ example: true })
  @IsOptional()
  verified: boolean;

  @ApiProperty({ example: 'admin|graduate' })
  @IsEnum(UserRole, { message: 'Invalid role' })
  @IsOptional()
  role: UserRole;
}
