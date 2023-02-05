import { Injectable } from '@nestjs/common';

export interface News {
  id: number;
  title: string;
  description: string;
  author: string;
  countView: number;
}

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

  create(news: News): number {
    return this.news.push(news);
  }

  edit(id: News['id'], news: News): News | null {
    const idx = this.findIndex(id);
    if (idx === -1) {
      return null;
    }
    const editedNews = this.news[idx];
    const finalNews = {
      ...editedNews,
      ...news
    };
    this.news.splice(idx, 1);
    this.news.push(finalNews);
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
