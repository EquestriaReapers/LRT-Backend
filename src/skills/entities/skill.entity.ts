import { Profile } from '../../profiles/entities/profile.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Profile, (profile) => profile.skills)
  profiles: Profile[];
}
