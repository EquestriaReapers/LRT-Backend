import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty()
  @IsString({
    message: 'El campo título debe ser string',
  })
  @IsNotEmpty({
    message: 'El campo título no debe estar vacío',
  })
  title: string;

  @ApiProperty()
  @IsString({
    message: 'El campo entidad debe ser string',
  })
  @IsNotEmpty({
    message: 'El campo entidad no debe estar vacío',
  })
  entity: string;

  @ApiProperty()
  @IsDateString(
    {},
    {
      message:
        'El campo fecha de inicio debe ser una fecha, ejemplo de formato: 2021-09-01',
    },
  )
  @IsNotEmpty({
    message: 'El campo fecha de inicio no debe estar vacío',
  })
  endDate: Date;
}
