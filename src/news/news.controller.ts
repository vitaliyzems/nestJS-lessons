import { Body, Controller, Delete, Get, Param, Post, Patch } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';

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
