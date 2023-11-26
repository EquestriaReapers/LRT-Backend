import { Profile } from '../../profiles/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
  name: string;

  @Column()
  role: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
