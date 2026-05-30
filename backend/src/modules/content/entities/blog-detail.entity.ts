import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ContentItem } from './content-item.entity';

@Entity('blog_details')
export class BlogDetail {
  @PrimaryColumn()
  contentItemId: string;

  @OneToOne(() => ContentItem)
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItem;

  @Column({ nullable: true })
  estimatedReadMinutes: number;

  @Column({ type: 'jsonb', nullable: true })
  relatedContentJson: object;
}
