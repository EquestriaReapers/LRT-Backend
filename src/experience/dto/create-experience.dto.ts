import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateExperienceDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    urlProyecto: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    cargo: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    descripcion: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    nombreProyecto: string;
  
    @ApiProperty({ type: "file" })
    file: Express.Multer.File;
}
