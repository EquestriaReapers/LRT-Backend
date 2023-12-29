import { ApiProperty } from '@nestjs/swagger';
import { Profile } from 'src/core/profiles/entities/profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';


@Entity()
export class Portafolio {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  titulo: string;

  @ApiProperty()
  @Column('date')
  fechaFinalizacion: Date;

  @ApiProperty()
  @Column()
  ubicacion: string;

  @ApiProperty()
  @Column('text')
  descripcion: string;

  @ApiProperty()
  @Column()
  imagen: string;

  @ApiProperty({ type: () => Profile })
  @ManyToOne(() => Profile, (profile) => profile.portafolios)
  profile: Profile;
}