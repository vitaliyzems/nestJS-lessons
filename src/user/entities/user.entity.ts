import { Comment } from 'src/comment/entities/comment.entity';
import { News } from 'src/news/entities/news.entity';
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  @OneToMany(() => News, news => news.user)
  news: News[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
