import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../constants/index';

import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column({
    unique: true,
  })
  documentNumber: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  lastname: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @ApiProperty()
  @Column('bool', { default: false })
  verified: boolean;

  @ApiProperty({ enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GRADUATE,
  })
  role: UserRole;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;
}
