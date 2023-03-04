import { Role } from 'src/auth/role/role.enum';
import { Comment } from 'src/comment/entities/comment.entity';
import { News } from 'src/news/entities/news.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  firstName: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  role: Role;

  @OneToMany(() => News, news => news.user)
  news: News[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
