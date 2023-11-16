import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExperienceDto } from './create-experience.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {
    @ApiProperty()
    @IsString()
    @IsOptional()
    urlProyecto: string;
  
    @ApiProperty({ example: 'Narrador de futbol en ESPN', required: true })
    @IsString()
    @IsOptional()
    cargo: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    descripcion: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    nombreProyecto: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    profileId: number;  
  
    @ApiProperty({ type: "file" })
    file: Express.Multer.File;
}
