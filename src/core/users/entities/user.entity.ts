import { UserRole } from '../../../constants/index';

import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column('bool', { default: false })
  verified: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GRADUATE,
  })
  role: UserRole;

  @DeleteDateColumn()
  deletedAt: Date;
}
