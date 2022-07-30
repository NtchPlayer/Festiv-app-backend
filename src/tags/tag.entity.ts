import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Publication } from '../publications/publication.entity';

@Entity('tags')
export class Tag {
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

  @Column('varchar', { length: 50 })
  content: string;

  @ManyToOne(() => User, (user) => user.tags, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  user: User;

  @ManyToMany(() => Publication, (publication) => publication.tags, {
    orphanedRowAction: 'delete',
  })
  publications: Publication[];
}
