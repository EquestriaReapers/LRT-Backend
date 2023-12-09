import { ApiProperty } from '@nestjs/swagger';
import { TypeContact } from 'src/constants/enum/contact/contact';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContactMethod {
  @ApiProperty()
  @PrimaryColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: TypeContact })
  type: TypeContact;

  @ApiProperty()
  @Column()
  value: string;
}
