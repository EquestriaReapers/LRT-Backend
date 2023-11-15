import { Profile } from "src/profiles/entities/profile.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Experience {

  @PrimaryColumn()
  userId: number;
  @OneToMany(() => Profile, profile => profile.experience)
  @JoinColumn({ name: "userId" })
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