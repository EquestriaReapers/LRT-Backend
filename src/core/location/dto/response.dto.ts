import { ApiProperty } from '@nestjs/swagger';

export class LocationResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  iso2: string;
}
