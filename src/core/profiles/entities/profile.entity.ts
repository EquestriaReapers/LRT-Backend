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
  PaginationMessage,
  SkillData,
  UserProfileData,
} from '../dto/responses.dto';

export enum Carrera {
  INGENIERIA_INDUSTRIAL = 'INGENIERIA INDUSTRIAL',
  INGENIERIA_INFORMATICA = 'INGENIERIA INFORMATICA',
  INGENIERIA_CIVIL = 'INGENIERIA CIVIL',
  INGENIERIA_TELECOMUNICACIONES = 'INGENIERIA TELECOMUNICACIONES',
  ARQUITECTURA = 'ARQUITECTURA',
  DERECHO = 'DERECHO',
  PSICOLOGIA = 'PSICOLOGIA',
  FILOSOFIA = 'FILOSOFIA',
  TEOLOGIA = 'TEOLOGIA',
  LETRAS = 'LETRAS',
  EDUCACION = 'EDUCACION',
  COMUNICACION_SOCIAL = 'COMUNICACION SOCIAL',
  ADMINISTRACION = 'ADMINISTRACION',
  CONTADURIA = 'CONTADURIA',
  RELACIONES_INDUSTRIALES = 'RELACIONES INDUSTRIALES',
  SOCIOLOGIA = 'SOCIOLOGIA',
  ECONOMIA = 'ECONOMIA',
}
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

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({ enum: Carrera })
  @Column({
    type: 'enum',
    enum: Carrera,
  })
  carrera: Carrera;
}
