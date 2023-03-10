import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsService } from 'src/news/news.service';
import { UserService } from 'src/user/user.service';
import { CommentEvents } from 'src/utils/Events.enum';
import { Repository } from 'typeorm';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly newsService: NewsService,
    private readonly userService: UserService,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async create(newsId: number, message: string, userId: number) {
    const _news = await this.newsService.getOneById(newsId);
    if (!_news) {
      throw new HttpException(
        `Новость с указанным идентификатором '${newsId}' не найдена`,
        HttpStatus.BAD_REQUEST
      );
    }
    const _user = await this.userService.findOne(Number(userId));
    if (!_user) {
      throw new HttpException(
        `Пользователь с указанным идентификатором '${userId}' не найден`,
        HttpStatus.BAD_REQUEST
      );
    }
    const comment = new Comment;
    comment.author = _user;
    comment.message = message;
    comment.news = _news;
    return this.commentRepository.save(comment);
  }

  async findAllCommentsForOneNews(newsId: number): Promise<Comment[]> {
    return await this.commentRepository.find({ where: { news: { id: newsId } }, relations: { 'author': true } });
  }

  async findOneById(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id }, relations: { 'news': true } });
  }

  async update(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const _comment = await this.commentRepository.findOne({ where: { id }, relations: ['author', 'news'] });
    _comment.message = dto.message;
    const _updatedComment = await this.commentRepository.save(_comment);
    this.eventEmitter.emit(CommentEvents.edit, {
      newsId: _comment.news.id,
      comment: _updatedComment
    });
    return _updatedComment;
  }

  async removeAllCommentsForOneNews(newsId: number): Promise<Comment[]> {
    const _comments = await this.findAllCommentsForOneNews(newsId);
    return await this.commentRepository.remove(_comments);
  }

  async remove(id: number): Promise<Comment> {
    const _comment = await this.findOneById(id);
    if (!_comment) {
      throw new HttpException(
        `Комментарий с указанным идентификатором '${id}' не найден`,
        HttpStatus.BAD_REQUEST
      );
    }
    this.eventEmitter.emit(CommentEvents.remove, {
      commentId: _comment.id,
      newsId: _comment.news.id
    });

    return await this.commentRepository.remove(_comment);
  }
}
