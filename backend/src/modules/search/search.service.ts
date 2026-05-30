import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentItem } from '../content/entities/content-item.entity';
import { ContentStatus } from '../../common/enums/content-status.enum';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ContentItem) private readonly repo: Repository<ContentItem>,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async search(query: string, filters: any = {}, userId: string) {
    const qb = this.repo.createQueryBuilder('c')
      .leftJoinAndSelect('c.author', 'author')
      .where('c.status = :status', { status: ContentStatus.PUBLISHED });

    if (query) {
      qb.andWhere(
        `to_tsvector('english', c.title || ' ' || COALESCE(c.summary, '') || ' ' || COALESCE(c.body, '')) @@ plainto_tsquery('english', :query)`,
        { query },
      );
    }

    if (filters.type) qb.andWhere('c.type = :type', { type: filters.type });
    if (filters.team) qb.andWhere('c.affectedTeam = :team', { team: filters.team });

    const results = await qb.orderBy('c.helpfulCount', 'DESC').addOrderBy('c.updatedAt', 'DESC').take(50).getMany();

    // Track search analytics
    await this.analyticsService.trackSearch(userId, query, results.length);

    return { results, total: results.length, query };
  }
}
