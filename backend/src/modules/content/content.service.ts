import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ContentItem } from './entities/content-item.entity';
import { IssueDetail } from './entities/issue-detail.entity';
import { ProcessDetail } from './entities/process-detail.entity';
import { BlogDetail } from './entities/blog-detail.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentStatus } from '../../common/enums/content-status.enum';
import { ContentType } from '../../common/enums/content-type.enum';
import { Role } from '../../common/enums/roles.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentItem) private readonly contentRepo: Repository<ContentItem>,
    @InjectRepository(IssueDetail) private readonly issueRepo: Repository<IssueDetail>,
    @InjectRepository(ProcessDetail) private readonly processRepo: Repository<ProcessDetail>,
    @InjectRepository(BlogDetail) private readonly blogRepo: Repository<BlogDetail>,
    private readonly auditService: AuditService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateContentDto, user: any): Promise<ContentItem> {
    const slug = await this.generateSlug(dto.title);
    const item = this.contentRepo.create({
      ...dto,
      slug,
      author: { id: user.id },
      owner: { id: user.id },
      status: ContentStatus.DRAFT,
      version: 1,
    });
    const saved = await this.contentRepo.save(item);
    await this.saveTypeDetail(saved.id, dto);
    await this.auditService.log(user.id, 'ContentItem', saved.id, 'create', null, saved);
    return this.findOne(saved.id);
  }

  async findAll(pagination: PaginationDto, filters: any = {}): Promise<{ data: ContentItem[]; total: number }> {
    const { page = 1, limit = 20 } = pagination;
    const qb = this.contentRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'author')
      .leftJoinAndSelect('c.owner', 'owner');

    if (filters.type) qb.andWhere('c.type = :type', { type: filters.type });
    if (filters.status) qb.andWhere('c.status = :status', { status: filters.status });
    if (filters.team) qb.andWhere('c.affectedTeam = :team', { team: filters.team });

    const [data, total] = await qb
      .orderBy('c.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(id: string): Promise<ContentItem> {
    const item = await this.contentRepo.findOne({ where: { id }, relations: ['author', 'owner'] });
    if (!item) throw new NotFoundException(`Content ${id} not found`);
    await this.contentRepo.increment({ id }, 'viewCount', 1);
    return item;
  }

  async update(id: string, dto: UpdateContentDto, user: any): Promise<ContentItem> {
    const item = await this.findOne(id);
    if (item.author.id !== user.id && user.role === Role.DEVELOPER) {
      throw new ForbiddenException('You can only edit your own content');
    }
    const before = { ...item };
    Object.assign(item, dto);
    const saved = await this.contentRepo.save(item);
    await this.auditService.log(user.id, 'ContentItem', id, 'update', before, saved);
    return saved;
  }

  async submitForReview(id: string, user: any): Promise<ContentItem> {
    const item = await this.findOne(id);
    if (item.status !== ContentStatus.DRAFT && item.status !== ContentStatus.REJECTED) {
      throw new BadRequestException('Only draft or rejected content can be submitted for review');
    }
    item.status = ContentStatus.IN_REVIEW;
    const saved = await this.contentRepo.save(item);
    await this.auditService.log(user.id, 'ContentItem', id, 'submit_for_review', null, saved);
    return saved;
  }

  async approve(id: string, user: any): Promise<ContentItem> {
    this.requireRole(user, [Role.LEAD, Role.MANAGER, Role.ADMIN]);
    const item = await this.findOne(id);
    item.status = ContentStatus.APPROVED;
    item.approvedAt = new Date();
    const saved = await this.contentRepo.save(item);
    await this.auditService.log(user.id, 'ContentItem', id, 'approve', null, saved);
    return saved;
  }

  async publish(id: string, user: any): Promise<ContentItem> {
    this.requireRole(user, [Role.LEAD, Role.MANAGER, Role.ADMIN]);
    const item = await this.findOne(id);
    if (item.status !== ContentStatus.APPROVED) {
      throw new BadRequestException('Content must be approved before publishing');
    }
    item.status = ContentStatus.PUBLISHED;
    item.publishedAt = new Date();
    item.version += 1;
    const saved = await this.contentRepo.save(item);
    await this.auditService.log(user.id, 'ContentItem', id, 'publish', null, saved);
    return saved;
  }

  async reject(id: string, user: any, reason?: string): Promise<ContentItem> {
    this.requireRole(user, [Role.LEAD, Role.MANAGER, Role.ADMIN]);
    const item = await this.findOne(id);
    item.status = ContentStatus.REJECTED;
    const saved = await this.contentRepo.save(item);
    await this.auditService.log(user.id, 'ContentItem', id, 'reject', null, { ...saved, reason });
    return saved;
  }

  async archive(id: string, user: any): Promise<ContentItem> {
    this.requireRole(user, [Role.LEAD, Role.MANAGER, Role.ADMIN]);
    const item = await this.findOne(id);
    item.status = ContentStatus.ARCHIVED;
    const saved = await this.contentRepo.save(item);
    await this.auditService.log(user.id, 'ContentItem', id, 'archive', null, saved);
    return saved;
  }

  private requireRole(user: any, roles: Role[]) {
    if (!roles.includes(user.role)) throw new ForbiddenException('Insufficient permissions');
  }

  private async generateSlug(title: string): Promise<string> {
    const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const count = await this.contentRepo.count({ where: {} });
    return `${base}-${Date.now()}`;
  }

  private async saveTypeDetail(id: string, dto: CreateContentDto) {
    if (dto.type === ContentType.ISSUE_ARTICLE && dto.issueDetail) {
      await this.issueRepo.save({ contentItemId: id, ...dto.issueDetail });
    } else if (dto.type === ContentType.PROCESS_DOC && dto.processDetail) {
      await this.processRepo.save({ contentItemId: id, ...dto.processDetail });
    } else if (dto.type === ContentType.BLOG_POST && dto.blogDetail) {
      await this.blogRepo.save({ contentItemId: id, ...dto.blogDetail });
    }
  }
}
