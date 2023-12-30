import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Language } from 'src/core/language/entities/language.entity';

export enum LanguageLevel {
  ALTO = 'alto',
  BAJO = 'bajo',
  NATIVO = 'nativo',
  INTERMEDIO = 'intermedio',
}

@Entity()
export class LanguageProfile {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  profileId: number;

  @ApiProperty()
  @Column()
  languageId: number;

  @ApiProperty({ enum: LanguageLevel })
  @Column({
    type: 'enum',
    enum: LanguageLevel,
    nullable: true,
  })
  level: LanguageLevel;

  @ManyToOne(() => Profile, (profile) => profile.languageProfile)
  profile: Profile;

  @ManyToOne(() => Language, (language) => language.languageProfile)
  language: Language;

  @Column({ default: false })
  isVisible: boolean;
}
