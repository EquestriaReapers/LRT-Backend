import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateIsVisibleDto {
  @ApiProperty()
  @IsBoolean({ message: 'isVisible debe ser un booleano' })
  @IsNotEmpty({ message: 'isVisible no debe estar vacío' })
  isVisible: boolean;
}
