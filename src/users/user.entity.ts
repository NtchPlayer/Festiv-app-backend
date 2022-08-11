import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  ManyToMany,
  BeforeUpdate,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Publication } from '../publications/publication.entity';
import { Media } from '../medias/media.entity';
import { Tag } from '../tags/tag.entity';

@Entity('users')
export class User {
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

  @Column('varchar', { length: 50, unique: true })
  name: string;

  @Column('varchar', { length: 50, unique: true })
  email: string;

  @Column('varchar', { length: 500 })
  password: string;

  @Column('varchar', { length: '32' })
  username: string;

  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @Column({ type: 'text', nullable: true })
  biography?: string;

  @Column({ type: 'boolean', default: false })
  isProfessional: boolean;

  @OneToMany(() => Publication, (publication) => publication.user, {
    cascade: true,
  })
  publications: Publication[];

  @OneToOne(() => Media, (media) => media.user, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  avatar: Media;

  @OneToMany(() => Tag, (tag) => tag.user, {
    cascade: true,
  })
  tags: Tag[];

  @ManyToMany(() => Publication, (publication) => publication.userLikes, {
    onDelete: 'CASCADE',
  })
  userLikes: Publication[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 8);
    }
  }
}
