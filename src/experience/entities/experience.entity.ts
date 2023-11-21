import { Profile } from 'src/profiles/entities/profile.entity';
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
  urlProyecto: string;

  @Column()
  cargo: string;

  @Column()
  descripcion: string;

  @Column()
  nombreProyecto: string;
}
