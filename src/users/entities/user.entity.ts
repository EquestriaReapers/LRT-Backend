import { UserRole } from "src/constants";

import {
    Column,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.GRADUATE,
    })
    role: UserRole

    @DeleteDateColumn()
    deletedAt: Date;
}
