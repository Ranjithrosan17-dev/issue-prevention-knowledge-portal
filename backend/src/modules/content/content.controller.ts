import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new content item (draft)' })
  create(@Body() dto: CreateContentDto, @CurrentUser() user: any) {
    return this.contentService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List all content with optional filters' })
  findAll(@Query() pagination: PaginationDto, @Query() filters: any) {
    return this.contentService.findAll(pagination, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateContentDto, @CurrentUser() user: any) {
    return this.contentService.update(id, dto, user);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.OK)
  submitForReview(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contentService.submitForReview(id, user);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contentService.approve(id, user);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contentService.publish(id, user);
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.OK)
  reject(@Param('id') id: string, @Body('reason') reason: string, @CurrentUser() user: any) {
    return this.contentService.reject(id, user, reason);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  archive(@Param('id') id: string, @CurrentUser() user: any) {
    return this.contentService.archive(id, user);
  }
}
