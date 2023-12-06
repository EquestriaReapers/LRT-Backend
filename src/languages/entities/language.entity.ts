import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from '../../core/profiles/entities/profile.entity';

@Entity()
export class Language {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  level: number;

  @ManyToMany(() => Profile, (profile) => profile.languages)
  profiles: Profile[];
}

