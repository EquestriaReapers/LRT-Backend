import { Profile } from '../../profiles/entities/profile.entity';
import * as fs from 'fs';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.experience)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column()
  nombre: string;

  @Column()
  rol: string;


  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
