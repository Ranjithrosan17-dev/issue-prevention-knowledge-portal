import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ContentItem } from '../content/entities/content-item.entity';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContentItem]), AnalyticsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
