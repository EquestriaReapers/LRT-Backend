import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Skill } from 'src/core/skills/entities/skill.entity';


@Entity()
export class SkillsProfile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  profileId: number;

  @Column()
  skillId: number;

  @ManyToOne(() => Profile, (profile) => profile.skillsProfile)
  profile: Profile;

  @ManyToOne(() => Skill, (skill) => skill.skillsProfile)
  skill: Skill;

  @Column({ default: false })
  isVisible: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}