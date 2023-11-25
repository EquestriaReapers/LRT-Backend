import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateExperienceDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    role: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    profileId: number;

    @ApiProperty({ type: "file" })
    file: Express.Multer.File;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    startDate: Date;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    endDate: Date;
}
