
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { UserRole } from '../../constants';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { isUniqueDb } from '@youba/nestjs-dbvalidator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @ApiProperty({ example: 'ronaldo@gmail.com' })
    @IsNotEmpty()
    @isUniqueDb({table : 'user', column: 'email', message: 'Email already exists'})
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @MinLength(6)
    @IsOptional()
    @Transform(({ value }) => value.trim())
    password: string;

    @ApiProperty({ example: "admin|graduate" })
    @IsNotEmpty()
    @IsEnum(UserRole, { message: 'Invalid role' })
    @IsOptional()
    role: UserRole;
}