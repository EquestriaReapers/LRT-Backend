import { Experience } from '../../experience/entities/experience.entity';
import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  userId: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'userId' }) // This matches @PrimaryColumn name
  user: User;

  @Column()
  description: string;

  @Column()
  mainTitle: string;

  @Column()
  countryResidence: string;

  @OneToMany(() => Experience, (experience) => experience.profile)
  experience: Experience[];

  @ManyToMany(() => Skill, (skill) => skill.profiles)
  @JoinTable()
  skills: Skill[];

  @DeleteDateColumn()
  deletedAt: Date;
}
