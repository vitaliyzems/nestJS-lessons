import { Controller, Get, Post, Patch, Param, Delete, Body, UseInterceptors, UploadedFile, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';
import { UserService } from 'src/user/user.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UpdateResult } from 'typeorm';
import { NewsService } from 'src/news/news.service';

const COMMENT_PATH = '/static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.set(COMMENT_PATH);

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly newsService: NewsService
  ) { }

  @Post('')
  @UseInterceptors(
    FilesInterceptor('avatar', 1, {
      storage: diskStorage({
        destination: helperFileLoader.destinationPath,
        filename: helperFileLoader.customFileName
      })
    }))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() avatar: Express.Multer.File[]
  ): Promise<Comment> {
    const _user = await this.userService.findOne(Number(createCommentDto.userId));
    if (!_user) {
      throw new HttpException(
        `Пользователь с указанным идентификатором '${createCommentDto.userId}' не найден`,
        HttpStatus.BAD_REQUEST
      );
    }
    const _news = await this.newsService.getOneById(Number(createCommentDto.newsId));
    if (!_news) {
      throw new HttpException(
        `Новость с указанным идентификатором '${createCommentDto.newsId}' не найдена`,
        HttpStatus.BAD_REQUEST
      );
    }
    const comment = new Comment();
    comment.message = createCommentDto.message;
    comment.author = _user;
    comment.news = _news;
    let imagePath: string | null = null;
    if (avatar[0]?.filename?.length > 0) {
      imagePath = COMMENT_PATH + avatar[0].filename;
    }
    comment.avatar = imagePath;
    return this.commentService.create(comment);
  }

  @Get('all/:newsId')
  findAllCommentsForOneNews(@Param('newsId') newsId: string): Promise<Comment[]> {
    return this.commentService.findAllCommentsForOneNews(Number(newsId));
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Comment> {
    return this.commentService.findOneById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<UpdateResult> {
    return this.commentService.update(Number(id), updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Comment> {
    const _comment = await this.commentService.findOneById(Number(id));
    if (!_comment) {
      throw new HttpException(
        `Комментарий с указанным идентификатором '${id}' не найден`,
        HttpStatus.BAD_REQUEST
      );
    }
    return this.commentService.remove(_comment);
  }
}
