import { Injectable } from '@nestjs/common';
import { getRandomInt } from 'src/utils/getRandomInt';
import { AllNews, News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  private readonly news: AllNews = {};

  getNews(): AllNews {
    return this.news;
  }

  findOne(id: number): News | null {
    return this.news[id] || null;
  }

  create(news: News): News {
    const id = getRandomInt(1, 100000);
    const finalNews = { id, ...news };
    this.news[id] = finalNews;
    return finalNews;
  }

  update(id: number, updatedNews: UpdatedNews): News | string {
    if (!this.news[id]) {
      return 'Новости с таким идентификатором не найдено';
    }
    const news = {
      ...this.news[id],
      ...updatedNews
    };
    this.news[id] = news;
    return this.news[id];
  }

  remove(id: number): string {
    if (!this.news[id]) {
      return 'Новости с таким идентификатором не найдено';
    }
    delete this.news[id];
    return 'Success';
  }
}
