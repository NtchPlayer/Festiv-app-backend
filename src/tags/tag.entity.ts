import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  BeforeInsert,
  BeforeRecover,
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
  })
  user: User;

  @ManyToMany(() => Publication, (publication) => publication.tags, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
  })
  publications: Publication[];

  @BeforeInsert()
  @BeforeRecover()
  transformContentToLowerCase() {
    this.content = this.content.toLowerCase();
  }
}
