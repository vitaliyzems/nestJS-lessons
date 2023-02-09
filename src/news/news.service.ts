import { Injectable } from '@nestjs/common';
import { News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';

const picUrl = 'https://ps.w.org/google-news-editors-picks-news-feeds/assets/icon.svg?rev=1028085';

const news1 = new News(1, 'Hello world', 'News from nest JS app', 'Vitaliy', picUrl);
const news2 = new News(2, 'Hello nestJS', 'News from nest JS app', 'Viktor', picUrl);
const news3 = new News(3, 'Learn JS', 'News from nest JS app', 'Jhon', picUrl);

@Injectable()
export class NewsService {
  private readonly news: News[] = [news1, news2, news3];

  getNews(): News[] {
    return this.news;
  }

  findOne(id: News['id']): News | null {
    return this.news.find(news => news.id === id) || null;
  }

  create(news: News): boolean {
    const { id, title, description, author, image } = news;
    const newNews = new News(id, title, description, author, image);
    this.news.push(newNews);
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
