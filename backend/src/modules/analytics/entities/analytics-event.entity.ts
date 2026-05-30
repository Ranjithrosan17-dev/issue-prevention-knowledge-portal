import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ length: 100 })
  eventType: string;

  @Column({ nullable: true })
  contentItemId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadataJson: object;

  @CreateDateColumn()
  createdAt: Date;
}
