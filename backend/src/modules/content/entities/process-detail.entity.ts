import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ContentItem } from './content-item.entity';

@Entity('process_details')
export class ProcessDetail {
  @PrimaryColumn()
  contentItemId: string;

  @OneToOne(() => ContentItem)
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItem;

  @Column({ type: 'text', nullable: true })
  prerequisites: string;

  @Column({ type: 'jsonb', nullable: true })
  checklistJson: object;

  @Column({ nullable: true })
  reviewCycleDays: number;

  @Column({ nullable: true, length: 100 })
  approvalStatus: string;
}
