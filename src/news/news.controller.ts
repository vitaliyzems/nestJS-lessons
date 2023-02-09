import { Body, Controller, Delete, Get, Param, Post, Patch, Redirect } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';
import { CommentsService } from '../comments/comments.service';
import { renderAllNews } from '../views/news/news-all';
import { renderTemplate } from 'src/views/template';
import { renderOneNews } from 'src/views/news/news-one';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService, private readonly commentsService: CommentsService) { }

  @Get('all')
  get(): News[] {
    return this.newsService.getNews();
  }

  @Get('views/all')
  getViewAll(): string {
    const content = renderAllNews(this.newsService.getNews());
    return renderTemplate(content);
  }

  @Get(':id')
  getOne(@Param('id') id: string): News {
    const news = this.newsService.findOne(Number(id));
    const comments = this.commentsService.find(Number(id));
    return {
      ...news,
      comments
    };
  }

  @Get('views/:id')
  getOneView(@Param('id') id: string): string {
    const news = this.newsService.findOne(Number(id));
    if (!news) {
      return this.getViewAll();
    }
    const comments = this.commentsService.find(Number(id));
    const content = renderOneNews({ ...news, comments });
    return renderTemplate(content);
  }

  @Post()
  create(@Body() news: News): boolean {
    return this.newsService.create(news);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedNews: UpdatedNews) {
    return this.newsService.update(Number(id), updatedNews);
  }

  @Delete(':id')
  remove(@Param('id') id: string): boolean {
    return this.newsService.remove(Number(id));
  }
}
