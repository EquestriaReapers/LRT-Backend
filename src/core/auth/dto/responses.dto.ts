import { ApiProperty } from '@nestjs/swagger';

export class EmailVerification {
  @ApiProperty()
  message: string;
}

export class SuccessfullyRegisterDTO {
  @ApiProperty()
  email: string;
  @ApiProperty()
  message: string;

  @ApiProperty({
    type: EmailVerification,
  })
  emailVerification: EmailVerification;
}

export class SuccessfullyLoginDTO {
  @ApiProperty()
  token: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  id: number;
}
