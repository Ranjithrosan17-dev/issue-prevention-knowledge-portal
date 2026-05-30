import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private readonly repo: Repository<Tag>) {}

  findAll() { return this.repo.find({ where: { isActive: true }, order: { name: 'ASC' } }); }

  create(name: string, type?: string) { return this.repo.save(this.repo.create({ name, type })); }
}
