import { ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Portfolio {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.portfolio)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column('date')
  dateEnd: Date;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  imagePrincipal: string;

  @ApiProperty()
  @Column('text', { array: true, nullable: true })
  image: string[];

  @ApiProperty()
  @Column({ nullable: true })
  url: string;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
