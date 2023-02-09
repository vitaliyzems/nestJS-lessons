import { Injectable } from '@nestjs/common';
import { Comment, Comments } from './dto/create-comment.dto';
import { ReplyComment } from './dto/reply-comment.dto';
import { UpdatedComment } from './dto/update-comment.dto';

const replyComment1 = new ReplyComment(11, 'My reply #1', 'George');
const replyComment2 = new ReplyComment(12, 'My reply #2', 'Max');
const replyComment3 = new ReplyComment(13, 'My reply #3', 'Tom');

const comment1 = new Comment(1, 'Like', 'Valentin', [replyComment1, replyComment2, replyComment3]);
const comment2 = new Comment(2, 'NestJS', 'Vasiliy');

@Injectable()
export class CommentsService {
  private readonly comments: Comments = {
    1: [comment1, comment2]
  };

  create(newsId: number, comment: Comment, commentId?: number): Comment {
    if (!this.comments[newsId]) {
      this.comments[newsId] = [];
    }
    const comments = this.comments[newsId];
    if (!commentId) {
      const { id, author, message } = comment;
      const newComment = new Comment(id, message, author);
      comments.push(newComment);
      return newComment;
    }
    const findedComment = this.findOne(newsId, commentId);
    findedComment.reply.push(comment);
    return comment;
  }

  find(newsId: number): Comment[] | null {
    return this.comments[newsId] || null;
  }

  private findOne(newsId: number, id: number): Comment {
    const comments = this.comments[newsId];
    const comment = comments.find(comment => comment.id === id);
    return comment;
  }

  update(newsId: number, id: number, updatedComment: UpdatedComment): string {
    const comments = this.comments[newsId];
    if (!comments || comments.length === 0) {
      return 'Комментариев нет';
    }
    const comment = comments.find(comment => comment.id === id);
    if (!comment) {
      return 'Данный комментарий не найден';
    }
    const idx = this.comments[newsId].indexOf(comment);
    const result = { ...comment, ...updatedComment };
    this.comments[newsId][idx] = result;
    return 'Success';
  }

  remove(newsId: number, id: number) {
    const comments = this.comments[newsId];
    if (comments.length === 0) {
      return 'Комментарии у указанной новости не найдены';
    }
    const searchComment = comments.find(comment => comment.id === id);
    if (!comments.includes(searchComment)) {
      return `Комментарий с id "${id}" не найден`;
    }
    this.comments[newsId] = comments.filter(comment => comment.id !== id);
    return 'Success';
  }
}
