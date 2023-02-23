import { Body, Controller, Delete, Get, Param, Post, Patch, UseInterceptors, UploadedFiles, Render } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './dto/create-news.dto';
import { Comment } from 'src/comments/dto/create-comment.dto';
import { UpdatedNews } from './dto/update-news.dto';
import { CommentsService } from '../comments/comments.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';
import { MailService } from 'src/mail/mail.service';

const NEWS_PATH = '/static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.set(NEWS_PATH);

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService
  ) { }

  @Get('all')
  getAllNews(): News[] {
    return this.newsService.getNews();
  }

  @Get('views/all')
  @Render('news-list')
  getViewAll(): { news: News[]; } {
    return { news: this.getAllNews() };
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

  @Get('views/create')
  @Render('news-create')
  getCreateView() {
    return {};
  }

  @Get('views/:id')
  @Render('news-detail')
  getDetailView(@Param('id') id: string): { detailNews: News, comments: Comment[]; } {
    const news = this.newsService.findOne(Number(id));
    const comments = this.commentsService.find(Number(id));
    return { detailNews: news, comments };
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName
      })
    }))
  async create(@Body() news: News, @UploadedFiles() image: Express.Multer.File) {
    let imagePath: string;
    if (image[0]?.filename?.length > 0) {
      imagePath = NEWS_PATH + image[0].filename;
    }
    const finalNews = this.newsService.create({ ...news, image: imagePath });
    await this.mailService.sendNewNewsForAdmins(['test@test.com'], finalNews);
    return finalNews;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatedNews: UpdatedNews): News | string {
    return this.newsService.update(Number(id), updatedNews);
  }

  @Delete(':id')
  remove(@Param('id') id: string): News[] | string {
    return this.newsService.remove(Number(id));
  }
}
