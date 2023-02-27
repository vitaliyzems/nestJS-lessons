import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(@InjectRepository(News) private newsRepository: Repository<News>) { }

  async create(news: News): Promise<News> {
    return await this.newsRepository.save(news);
  }

  async getAllNews(): Promise<News[]> {
    return await this.newsRepository.find();
  }

  async getAllNewsByUser(userId: number): Promise<News[]> {
    return await this.newsRepository.findBy({ 'user': { id: userId } });
  }

  async getOneById(id: number): Promise<News> {
    return await this.newsRepository.findOne({ where: { id }, relations: { 'user': true } });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<UpdateResult> {
    return await this.newsRepository.update(id, updateNewsDto);
  }

  async remove(news: News): Promise<News> {
    return await this.newsRepository.remove(news);
  }
}
