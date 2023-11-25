
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../../constants';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ example: 'John' })
    @IsOptional()
    name: string;

    @ApiProperty({ example: 'Winchester' })
    @IsOptional()
    lastname: string;

    @ApiProperty({ example: 'ronaldo@gmail.com' })
    @isUniqueDb({ table: 'user', column: 'email', message: 'Email already exists' })
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


    @ApiProperty({ example: "admin|graduate" })
    @IsEnum(UserRole, { message: 'Invalid role' })
    @IsOptional()
    role: UserRole;
}