import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
// import { RefreshToken } from '../token/refresh-token.entity';
import { Publication } from '../publications/publication.entity';
import { Media } from '../medias/media.entity';

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

  @Column('varchar', { length: 50 })
  email: string;

  @Column('varchar', { length: 500 })
  password: string;

  @Column('varchar', { length: '32' })
  username: string;

  @Column({ type: 'date', nullable: true })
  birthday?: string;

  @Column({ type: 'text', nullable: true })
  biography?: string;

  @OneToMany(() => Publication, (publication) => publication.user, {
    cascade: true,
  })
  publications: Publication[];

  @OneToOne(() => Media)
  @JoinColumn()
  avatar: Media;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 8);
  }
}
