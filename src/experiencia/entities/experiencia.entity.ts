import { Profile } from "src/profiles/entities/profile.entity";
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";

@Entity()
export class Experiencia {

  @PrimaryColumn()
  profileId: number;
  @OneToMany(() => Profile, profile => profile.experiencia)
  profile: Profile[];

  @Column()
  urlProyecto: string;

  @Column()
  cargo: string;

  @Column()
  descripcion: string;

  @Column()
  nombreProyecto: string;
}
