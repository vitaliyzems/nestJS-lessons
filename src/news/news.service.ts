import { Injectable } from '@nestjs/common';
import { News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';

const news1: News = {
  id: 1,
  title: 'Hello world',
  description: 'News from nest JS app',
  author: 'Vitaliy',
  countView: 0
};

@Injectable()
export class NewsService {
  private readonly news: News[] = [news1];

  getNews(): News[] {
    return this.news;
  }

  findOne(id: News['id']): News | undefined {
    return this.news.find(news => news.id === id);
  }

  create(news: News): boolean {
    this.news.push(news);
    return true;
  }

  update(id: News['id'], updatedNews: UpdatedNews): News | null {
    const idx = this.findIndex(id);
    if (idx === -1) {
      return null;
    }
    const editedNews = this.news[idx];
    const finalNews = {
      ...editedNews,
      ...updatedNews
    };
    this.news[idx] = finalNews;
    return finalNews;
  }

  remove(id: News['id']): boolean {
    const idx = this.findIndex(id);
    if (idx === -1) {
      return false;
    }
    this.news.splice(idx, 1);
    return true;
  }

  private findIndex(id: number): number {
    return this.news.findIndex(news => news.id === id);
  }
}
