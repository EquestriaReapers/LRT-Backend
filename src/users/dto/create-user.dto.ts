import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength} from "class-validator";
import { UserRole } from "src/constants";
import { isUniqueDb } from "@youba/nestjs-dbvalidator";
import { Transform } from "class-transformer";

export class CreateUserDto {

        
    @ApiProperty({ example: 'John', required: true })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'ronaldo@gmail.com', required: true})
    @IsNotEmpty()
    @isUniqueDb({table : 'user', column: 'email', message: 'Email already exists'})
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456', required: true})
    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    @Transform(({ value }) => value.trim())
    password: string;

    @ApiProperty({ example: "admin|graduate", required: true})
    @IsNotEmpty()
    @IsEnum(UserRole, { message: 'Invalid role' })
    role: UserRole;
}