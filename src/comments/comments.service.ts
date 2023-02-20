import { Injectable } from '@nestjs/common';
import { getRandomInt } from 'src/utils/getRandomInt';
import { Comment, Comments } from './dto/create-comment.dto';
import { UpdatedComment } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  private readonly comments: Comments = {};

  create(newsId: number, comment: Comment, commentId?: number): Comment | string {
    if (!this.comments[newsId]) {
      this.comments[newsId] = [];
    }
    const id = getRandomInt(1, 100000);
    const newComment = { id, ...comment };

    if (!commentId) {
      this.comments[newsId].push(newComment);
      return newComment;
    }

    const replyedComment = this.comments[newsId].find(comment => comment.id === commentId);

    if (!replyedComment) {
      return 'Комментарий не найден';
    }

    if (!replyedComment.reply) {
      replyedComment.reply = [];
    }

    const replyId = getRandomInt(1, 100000);
    const replyComment = { replyId, ...comment };
    replyedComment.reply.push(replyComment);
    return replyComment;
  }

  find(newsId: number): Comment[] | null {
    return this.comments[newsId] || null;
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
