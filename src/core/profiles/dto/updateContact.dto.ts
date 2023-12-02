import { IsString } from "class-validator";

export class UpdateContactMethodDto {
  @IsString()
  type: string;

  @IsString()
  value: string;
}