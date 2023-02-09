import { ReplyComment } from './reply-comment.dto';

export class Comment {
  id: number;
  message: string;
  author: string;
  reply?: ReplyComment[];

  constructor(id: number, message: string, author: string, reply?: ReplyComment[]) {
    this.id = id;
    this.message = message;
    this.author = author;
    this.reply = reply ?? [];
  }
}

export interface Comments {
  [key: number]: Comment[];
}
