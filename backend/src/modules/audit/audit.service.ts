import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(@InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>) {}

  async log(actorId: string, entityType: string, entityId: string, action: string, before: any, after: any) {
    await this.repo.save(this.repo.create({ actorId, entityType, entityId, action, beforeJson: before, afterJson: after }));
  }

  findAll(page = 1, limit = 50) {
    return this.repo.find({ order: { createdAt: 'DESC' }, skip: (page - 1) * limit, take: limit });
  }
}
