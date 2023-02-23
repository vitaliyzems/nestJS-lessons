import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReplyComment } from './reply-comment.dto';

export class Comment {
  public id?: number;

  @IsNotEmpty()
  @IsString()
  public message: string;

  @IsNotEmpty()
  @IsString()
  public author: string;

  @IsOptional()
  @IsString()
  public avatar: string;

  public reply?: ReplyComment[];
}

export interface Comments {
  [key: number]: Comment[];
}
