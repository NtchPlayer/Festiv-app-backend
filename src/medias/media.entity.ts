import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Publication } from '../publications/publication.entity';
import { User } from '../users/user.entity';

@Entity('medias')
export class Media {
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

  @Column('text')
  url: string;

  @Column('text', { unique: true })
  key: string;

  @Column('varchar', { length: 250, nullable: true })
  alt: string;

  @Column('varchar', { length: 20 })
  type: string;

  @ManyToOne(() => Publication, (publication) => publication.medias, {
    onDelete: 'CASCADE',
  })
  publication: Publication;

  @OneToOne(() => User, (user) => user.avatar, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
