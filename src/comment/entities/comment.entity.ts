import { News } from 'src/news/entities/news.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column('text', { nullable: true })
  avatar: string;

  @ManyToOne(() => User, user => user.comments)
  author: User;

  @ManyToOne(() => News, news => news.comments)
  news: News;
}
