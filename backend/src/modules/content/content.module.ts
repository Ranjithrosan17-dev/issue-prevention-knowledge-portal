import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentItem } from './entities/content-item.entity';
import { IssueDetail } from './entities/issue-detail.entity';
import { ProcessDetail } from './entities/process-detail.entity';
import { BlogDetail } from './entities/blog-detail.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentItem, IssueDetail, ProcessDetail, BlogDetail]),
    AuditModule,
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
