import { Comment } from '../../comments/dto/create-comment.dto';

export class News {
  id: number;
  title: string;
  description: string;
  author: string;
  comments: Comment[];
  image?: string;

  constructor(id: number, title: string, description: string, author: string, image?: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.author = author;
    this.comments = [];
    this.image = image;
  };
}