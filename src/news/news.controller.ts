import { Body, Controller, Delete, Get, Param, Post, Patch, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NewsService } from './news.service';
import { AllNews, News } from './dto/create-news.dto';
import { UpdatedNews } from './dto/update-news.dto';
import { CommentsService } from '../comments/comments.service';
import { renderAllNews } from '../views/news/news-all';
import { renderTemplate } from 'src/views/template';
import { renderOneNews } from 'src/views/news/news-one';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';

const NEWS_PATH = '/static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.set(NEWS_PATH);

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService, private readonly commentsService: CommentsService) { }

  @Get('all')
  get(): AllNews {
    return this.newsService.getNews();
  }

  @Get('views/all')
  getViewAll(): string {
    const content = renderAllNews(this.newsService.getNews());
    return renderTemplate(content);
  }

  @Get(':id')
  getOne(@Param('id') id: string): News | string {
    if (!this.newsService.findOne(Number(id))) {
      return 'Новость не найдена';
    }
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

  // @Post('upload')
  // @UseInterceptors(
  //   FilesInterceptor('cover', 1, {
  //     storage: diskStorage({
  //       destination: helperFileLoader.destinationPath,
  //       filename: helperFileLoader.customFileName
  //     })
  //   })
  // )
  // uploadFile(@UploadedFiles() file: Express.Multer.File) {
  //   console.log(file);
  // };

  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName
      })
    }))
  create(@Body() news: News, @UploadedFiles() image: Express.Multer.File): News {
    let imagePath: string;
    if (image[0]?.filename?.length > 0) {
      imagePath = NEWS_PATH + image[0].filename;
    }
    const finalNews = { ...news, image: imagePath };
    return this.newsService.create(finalNews);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedNews: UpdatedNews): News | string {
    return this.newsService.update(Number(id), updatedNews);
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return this.newsService.remove(Number(id));
  }
}
