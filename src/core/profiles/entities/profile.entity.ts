import { Experience } from '../../experience/entities/experience.entity';
import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  ExperienceData,
  SkillData,
  UserProfileData,
} from '../dto/responses.dto';
import { LanguageProfile } from './language-profile.entity';

@Entity()
export class Profile {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty({
    type: UserProfileData,
  })
  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'userId' }) // This matches @PrimaryColumn name
  user: User;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  mainTitle: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  countryResidence: string;

  @ApiProperty({
    type: [ExperienceData],
  })
  @OneToMany(() => Experience, (experience) => experience.profile)
  experience: Experience[];

  @ApiProperty({
    type: [SkillData],
  })
  @ManyToMany(() => Skill, (skill) => skill.profiles)
  @JoinTable()
  skills: Skill[];

  @OneToMany(
    () => LanguageProfile,
    (languageProfile) => languageProfile.profile,
  )
  languageProfile: LanguageProfile[];

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
