import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { News, NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get('all')
  get(): News[] {
    return this.newsService.getNews();
  }

  @Get(':id')
  getOne(@Param('id') id: string): News {
    return this.newsService.findOne(Number(id));
  }

  @Post()
  create(@Body() news: News): number {
    return this.newsService.create(news);
  }

  @Post(':id')
  edit(@Param('id') id: string, @Body() news: News) {
    return this.newsService.edit(Number(id), news);
  }

  @Delete(':id')
  remove(@Param('id') id: string): boolean {
    return this.newsService.remove(Number(id));
  }
}
