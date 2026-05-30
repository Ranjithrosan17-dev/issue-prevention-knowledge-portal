import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from './entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
  constructor(@InjectRepository(AnalyticsEvent) private readonly repo: Repository<AnalyticsEvent>) {}

  async trackSearch(userId: string, query: string, resultCount: number) {
    await this.repo.save(this.repo.create({
      userId,
      eventType: resultCount === 0 ? 'failed_search' : 'search',
      metadataJson: { query, resultCount },
    }));
  }

  async trackView(userId: string, contentItemId: string) {
    await this.repo.save(this.repo.create({ userId, eventType: 'view', contentItemId }));
  }

  async trackHelpful(userId: string, contentItemId: string, helpful: boolean) {
    await this.repo.save(this.repo.create({
      userId, eventType: 'helpful_vote', contentItemId,
      metadataJson: { helpful },
    }));
  }

  async getDashboardMetrics(role: string) {
    const totalEvents = await this.repo.count();
    const failedSearches = await this.repo.count({ where: { eventType: 'failed_search' } });
    const views = await this.repo.count({ where: { eventType: 'view' } });
    return { totalEvents, failedSearches, views };
  }
}
