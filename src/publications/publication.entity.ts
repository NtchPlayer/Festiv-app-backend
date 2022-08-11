import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Media } from '../medias/media.entity';
import { Tag } from '../tags/tag.entity';

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

  @Column('text')
  content: string;

  @Column('varchar', { length: 36, nullable: true, unique: true })
  folder: string;

  @ManyToOne(() => User, (user) => user.publications, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Media, (media) => media.publication, {
    cascade: true,
  })
  medias: Media[];

  @ManyToMany(() => Tag, (tag) => tag.publications, {
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => User, (user) => user.userLikes, {
    cascade: true,
  })
  @JoinTable()
  userLikes: User[];

  @ManyToOne(() => Publication, (publication) => publication.comments, {
    onDelete: 'CASCADE',
  })
  parentPublication: Publication;

  @OneToMany(
    () => Publication,
    (publication) => publication.parentPublication,
    {
      cascade: true,
    },
  )
  comments: Publication[];
}
