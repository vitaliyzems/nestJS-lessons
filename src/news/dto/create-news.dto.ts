import { Comment } from '../../comments/dto/create-comment.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class News {
  @IsOptional()
  @IsNumber()
  public id?: number;

  @IsNotEmpty()
  @IsString()
  public title: string;

  @IsNotEmpty()
  @IsString()
  public description: string;

  @IsNotEmpty()
  @IsString()
  public author: string;

  public comments: Comment[];

  @IsOptional()
  @IsString()
  public image?: string;
}

export type AllNews = Record<number, News>;