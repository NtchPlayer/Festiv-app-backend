import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Media } from '../medias/media.entity';

@Entity('publications')
export class Publication {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column()
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column('varchar', { length: 500 })
  content: string;

  @Column('varchar', { length: 36, nullable: true })
  folder: string;

  @ManyToOne(() => User, (user) => user.publications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Media, (media) => media.publication, {
    cascade: true,
  })
  medias: Media[];
}
