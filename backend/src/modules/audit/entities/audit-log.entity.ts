import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  actorId: string;

  @Column({ length: 100 })
  entityType: string;

  @Column()
  entityId: string;

  @Column({ length: 100 })
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  beforeJson: object;

  @Column({ type: 'jsonb', nullable: true })
  afterJson: object;

  @CreateDateColumn()
  createdAt: Date;
}
