import { IsOptional, IsString } from 'class-validator';

export class ReplyComment {
  public id?: number;

  @IsOptional()
  @IsString()
  public message: string;

  @IsOptional()
  @IsString()
  public author: string;

  @IsOptional()
  @IsString()
  public avatar: string;
}