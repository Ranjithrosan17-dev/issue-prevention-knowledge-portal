import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private readonly repo: Repository<Comment>) {}

  findByContent(contentItemId: string) {
    return this.repo.find({
      where: { contentItem: { id: contentItemId } },
      order: { createdAt: 'ASC' },
      relations: ['author'],
    });
  }

  create(contentItemId: string, authorId: string, body: string, parentCommentId?: string) {
    const comment = this.repo.create({
      contentItem: { id: contentItemId } as any,
      author: { id: authorId } as any,
      body,
      parentCommentId,
    });
    return this.repo.save(comment);
  }
}
