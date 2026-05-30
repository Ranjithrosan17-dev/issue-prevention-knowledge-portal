import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContentItem } from './entities/content-item.entity';
import { IssueDetail } from './entities/issue-detail.entity';
import { ProcessDetail } from './entities/process-detail.entity';
import { BlogDetail } from './entities/blog-detail.entity';
import { AuditService } from '../audit/audit.service';
import { DataSource } from 'typeorm';

const mockRepo = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
  increment: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getRepositoryToken(ContentItem), useFactory: mockRepo },
        { provide: getRepositoryToken(IssueDetail), useFactory: mockRepo },
        { provide: getRepositoryToken(ProcessDetail), useFactory: mockRepo },
        { provide: getRepositoryToken(BlogDetail), useFactory: mockRepo },
        { provide: AuditService, useValue: { log: jest.fn() } },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
