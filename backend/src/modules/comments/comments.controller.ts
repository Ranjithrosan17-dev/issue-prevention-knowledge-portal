import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content/:contentId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Param('contentId') contentId: string) {
    return this.commentsService.findByContent(contentId);
  }

  @Post()
  create(
    @Param('contentId') contentId: string,
    @CurrentUser('id') userId: string,
    @Body('body') body: string,
    @Body('parentCommentId') parentCommentId?: string,
  ) {
    return this.commentsService.create(contentId, userId, body, parentCommentId);
  }
}
