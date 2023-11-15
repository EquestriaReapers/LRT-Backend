import { Experience } from "src/experience/entities/experience.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Profile {

  @PrimaryColumn()
  userId: number;
  @OneToOne(() => User, { "cascade": true })
  @JoinColumn({ name: "userId" })  // This matches @PrimaryColumn name
  user: User;


  @Column()
  description: string;

  @Column()
  image: string;

  @OneToMany(() => Experience, experience => experience.userId)
  experience: Experience[];
}
