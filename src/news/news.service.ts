import { Injectable } from '@nestjs/common';
import { getRandomInt } from 'src/utils/getRandomInt';
import { News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  private readonly news: News[] = [];

  getNews(): News[] {
    return this.news;
  }

  findOne(id: number): News | null {
    const news = this.news.find(news => news.id === id);
    return news;
  }

  create(news: News): News {
    const id = getRandomInt(1, 100000);
    const finalNews = { id, ...news };
    this.news.unshift(finalNews);
    return finalNews;
  }

  update(id: number, updatedNews: UpdatedNews): News | string {
    const news = this.news.find(news => news.id === id);
    if (!news) {
      return 'Новости с таким идентификатором не найдено';
    }
    const idx = this.news.indexOf(news);
    const finalNews = {
      ...news,
      ...updatedNews
    };
    this.news[idx] = finalNews;
    return finalNews;
  }

  remove(id: number): News[] | string {
    const news = this.news.find(news => news.id === id);
    if (!news) {
      return 'Новости с таким идентификатором не найдено';
    }
    const idx = this.news.indexOf(news);
    return this.news.splice(idx, 1);
  }
}
