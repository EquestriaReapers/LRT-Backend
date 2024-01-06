import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/core/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ForgotPassword {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @IsString()
  @IsNotEmpty()
  @Column()
  token: string;

  @Column()
  timestamp: Date;
}
