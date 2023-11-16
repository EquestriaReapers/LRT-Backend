import { Skill } from "src/skills/entities/skill.entity";
import { Experience } from "src/experience/entities/experience.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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


  @ManyToMany(() => Skill, (skill) => skill.profiles)
  @JoinTable()
  skills: Skill[];

  @DeleteDateColumn()
  deletedAt: Date;
}
