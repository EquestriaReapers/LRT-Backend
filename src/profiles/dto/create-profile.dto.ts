import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class CreateProfileDTO {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({type:"file"})
    file: Express.Multer.File;
}
