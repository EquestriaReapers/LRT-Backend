import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Language } from 'src/core/language/entities/language.entity';

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

  @ApiProperty()
  @Column()
  level: string;

  @ApiProperty()
  @OneToMany(() => Profile, (profile) => profile.languageProfile)
  profile: Profile;

  @ApiProperty()
  @OneToMany(() => Language, (language) => language.languageProfile)
  language: Language;
}
