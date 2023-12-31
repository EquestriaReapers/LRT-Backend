import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '../../profiles/entities/profile.entity';
import {
  Column,
  DeleteDateColumn,
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
  businessName: string;

  @ApiProperty()
  @Column()
  role: string;

  @ApiProperty()
  @Column()
  location: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  startDate: Date;

  @ApiProperty()
  @Column({
    default: null,
  })
  endDate: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: true })
  isVisible: boolean;
}
