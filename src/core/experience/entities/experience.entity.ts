import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profiles/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Experience {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.experience)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  role: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  @Column()
  startDate: Date;

  @ApiProperty()
  @Column({
    default: null,
  })
  endDate: Date;
}
