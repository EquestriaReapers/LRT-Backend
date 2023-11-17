import { Experience } from "src/experience/entities/experience.entity";
import { User } from "src/users/entities/user.entity";
import { Skill } from "src/skills/entities/skill.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Profile {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User, { "cascade": true })
  @JoinColumn({ name: "userId" })  // This matches @PrimaryColumn name
  user: User;


  @Column()
  description: string;

  //@Column()
  //image: string;

  @OneToMany(() => Experience, experience => experience.profile)
  experience: Experience[];

  @ManyToMany(() => Skill, (skill) => skill.profiles)
  @JoinTable()
  skills: Skill[];

  @DeleteDateColumn()
  deletedAt: Date;
}
