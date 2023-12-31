import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationDto } from './create-education.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateEducationDto extends PartialType(CreateEducationDto) {
  @ApiProperty()
  @IsBoolean({ message: 'El campo principal debe ser booleano' })
  @IsOptional()
  principal: boolean;

  @ApiProperty()
  @IsString({
    message: 'El campo título debe ser string',
  })
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString({
    message: 'El campo entidad debe ser string',
  })
  @IsOptional()
  entity: string;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message:
        'El campo fecha de inicio debe ser una fecha, ejemplo de formato: 2021-09-01',
    },
  )
  @IsOptional()
  endDate: Date;
}
