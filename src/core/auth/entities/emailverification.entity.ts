import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailVerificationEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @IsEmail()
  @Column()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  emailToken: string;

  @IsDate()
  @Column()
  timestamp: Date;
}
