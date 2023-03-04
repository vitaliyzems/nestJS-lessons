import { Body, Controller, Delete, Get, Param, Post, Patch, UseInterceptors, UploadedFiles, Render, HttpException, HttpStatus } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';
import { MailService } from 'src/mail/mail.service';
import { News } from './entities/news.entity';
import { UpdateResult } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { CommentService } from 'src/comment/comment.service';
import { Comment } from 'src/comment/entities/comment.entity';

const NEWS_PATH = '/static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.set(NEWS_PATH);

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly commentService: CommentService
  ) { }

  @Get('all')
  async getAllNews(): Promise<News[]> {
    const news = await this.newsService.getAllNews();
    return news;
  }

  @Get('views/all')
  @Render('news-list')
  async getViewAll(): Promise<{ news: News[]; }> {
    return { news: await this.getAllNews() };
  }

  @Get('all/:userId')
  async getAllNewsByUser(@Param('userId') userId: string): Promise<News[]> {
    return this.newsService.getAllNewsByUser(Number(userId));
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<News> {
    return await this.newsService.getOneById(Number(id));
  }

  @Get('views/create')
  @Render('news-create')
  getCreateView() {
    return {};
  }

  @Get('views/:id')
  @Render('news-detail')
  async getDetailView(@Param('id') id: string): Promise<{ detailNews: News, comments: Comment[]; }> {
    const _news = await this.newsService.getOneById(Number(id));
    const _comments = await this.commentService.findAllCommentsForOneNews(Number(id));
    return { detailNews: _news, comments: _comments };
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('cover', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName
      })
    }))
  async create(@Body() createNewsDto: CreateNewsDto, @UploadedFiles() image: Express.Multer.File[]): Promise<News> {
    const _user = await this.userService.findOne(Number(createNewsDto.userId));
    if (!_user) {
      throw new HttpException(
        'Такого пользователя не существует',
        HttpStatus.BAD_REQUEST
      );
    }
    const _category = await this.categoryService.findOneById(Number(createNewsDto.categoryId));
    if (!_category) {
      throw new HttpException(
        'Такой категории не существует',
        HttpStatus.BAD_REQUEST
      );
    }
    let imagePath: string;
    if (image[0]?.filename?.length > 0) {
      imagePath = NEWS_PATH + image[0].filename;
    }
    const news = new News();
    news.title = createNewsDto.title;
    news.description = createNewsDto.description;
    news.cover = imagePath;
    news.user = _user;
    news.category = _category;
    // await this.mailService.sendNewNewsForAdmins(['zemc96@icloud.com'], news);
    return this.newsService.create(news);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto): Promise<UpdateResult> {
    return this.newsService.update(Number(id), updateNewsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<News> {
    await this.commentService.removeAllCommentsForOneNews(Number(id));
    const _news = await this.newsService.getOneById(Number(id));
    return this.newsService.remove(_news);
  }
}
