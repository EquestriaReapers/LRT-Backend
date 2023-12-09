import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profiles/entities/profile.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skill {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  level: number;

  @ManyToMany(() => Profile, (profile) => profile.skills)
  profiles: Profile[];
}
