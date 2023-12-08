import { ApiProperty } from '@nestjs/swagger';
import { LanguageProfile } from 'src/core/profiles/entities/language-profile.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @OneToMany(
    () => LanguageProfile,
    (languageProfile) => languageProfile.language,
  )
  languageProfile: LanguageProfile[];
}
