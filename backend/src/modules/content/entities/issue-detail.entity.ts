import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { ContentItem } from './content-item.entity';
import { Severity } from '../../../common/enums/severity.enum';

@Entity('issue_details')
export class IssueDetail {
  @PrimaryColumn()
  contentItemId: string;

  @OneToOne(() => ContentItem)
  @JoinColumn({ name: 'content_item_id' })
  contentItem: ContentItem;

  @Column({ nullable: true, length: 100 })
  category: string;

  @Column({ type: 'enum', enum: Severity, default: Severity.MEDIUM })
  severity: Severity;

  @Column({ nullable: true, length: 100 })
  environment: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ type: 'text', nullable: true })
  rootCause: string;

  @Column({ type: 'text', nullable: true })
  resolutionSteps: string;

  @Column({ type: 'text', nullable: true })
  preventiveActions: string;
}
