import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class UpdateExperienciaDTO {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  urlProyecto: string;

  @ApiProperty({ example: 'Narrador de futbol en ESPN', required: true })
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