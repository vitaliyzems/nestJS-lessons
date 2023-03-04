import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(@InjectRepository(Comment) private commentRepository: Repository<Comment>) { }

  async create(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  async findAllCommentsForOneNews(newsId: number): Promise<Comment[]> {
    return await this.commentRepository.findBy({ news: { id: newsId } });
  }

  async findOneById(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id }, relations: { 'news': true } });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
    return await this.commentRepository.update(id, updateCommentDto);
  }

  async removeAllCommentsForOneNews(newsId: number): Promise<Comment[]> {
    const _comments = await this.findAllCommentsForOneNews(newsId);
    return await this.commentRepository.remove(_comments);
  }

  async remove(comment: Comment): Promise<Comment> {
    return await this.commentRepository.remove(comment);
  }
}
