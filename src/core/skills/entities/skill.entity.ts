import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profiles/entities/profile.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum SkillType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}
@Entity()
export class Skill {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ enum: SkillType })
  @Column({
    type: 'enum',
    enum: SkillType,
    nullable: false,
    default: SkillType.HARD,
  })
  type: SkillType;

  @ManyToMany(() => Profile, (profile) => profile.skills)
  profiles: Profile[];
}
