export class ReplyComment {
  id: number;
  message: string;
  author: string;

  constructor(id: number, message: string, author: string) {
    this.id = id;
    this.message = message;
    this.author = author;
  }
}