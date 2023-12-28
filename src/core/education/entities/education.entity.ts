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
export class Education {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  profileId: number;

  @ManyToOne(() => Profile, (profile) => profile.education)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @ApiProperty()
  @Column('bool', { default: false })
  principal: boolean;

  @ApiProperty()
  @Column('bool', { default: false })
  isUCAB: boolean;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  entity: string;

  @ApiProperty()
  @Column()
  endDate: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deleteAt: Date;
}
