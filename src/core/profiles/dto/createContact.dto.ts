import { IsString } from "class-validator";

export class CreateContactDto {
  @IsString()
  type: string;

  @IsString()
  value: string;
}