import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ContentType } from '../../../common/enums/content-type.enum';
import { ContentStatus } from '../../../common/enums/content-status.enum';

@Entity('content_items')
export class ContentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ContentType })
  type: ContentType;

  @Column({ length: 255 })
  title: string;

  @Column({ unique: true, length: 300 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'enum', enum: ContentStatus, default: ContentStatus.DRAFT })
  status: ContentStatus;

  @Column({ default: 1 })
  version: number;

  @Column({ nullable: true, length: 100 })
  affectedTeam: string;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  publishedAt: Date;

  @Column({ nullable: true })
  lastReviewedAt: Date;

  @Column({ nullable: true })
  nextReviewAt: Date;

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
