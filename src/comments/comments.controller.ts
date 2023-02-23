import { Body, Controller, Delete, Get, Param, Patch, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';
import { CommentsService } from './comments.service';
import { Comment } from './dto/create-comment.dto';
import { UpdatedComment } from './dto/update-comment.dto';

const COMMENTS_PATH = '/static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.set(COMMENTS_PATH);

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get('views/create/:newsId')
  @Render('comment-create')
  getCreateView(@Param('newsId') newsId: string): { newsId: string; } {
    return { newsId };
  }

  @Get(':newsId')
  get(@Param('newsId') newsId: string): Comment[] {
    return this.commentsService.find(Number(newsId));
  }

  @Post(':newsId')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: helperFileLoader.destinationPath,
      filename: helperFileLoader.customFileName
    })
  }))
  create(@Param('newsId') newsId: string, @Body() comment: Comment, @UploadedFile() image: Express.Multer.File): Comment | string {
    if (!image) {
      return this.commentsService.create(Number(newsId), comment);
    }
    const imagePath: string = COMMENTS_PATH + image.filename;
    const newComment = { ...comment, avatar: imagePath };
    return this.commentsService.create(Number(newsId), newComment);
  };

  @Post(':newsId/:id')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: helperFileLoader.destinationPath,
      filename: helperFileLoader.customFileName
    })
  }))
  reply(@Param('newsId') newsId: string, @Body() comment: Comment, @Param('id') id: string, @UploadedFile() image: Express.Multer.File) {
    if (!image) {
      return this.commentsService.create(Number(newsId), comment, Number(id));
    }
    const imagePath: string = COMMENTS_PATH + image.filename;
    const newComment = { ...comment, avatar: imagePath };
    return this.commentsService.create(Number(newsId), newComment, Number(id));
  }

  @Patch(':newsId/:id')
  update(@Param('newsId') newsId: string, @Param('id') id: string, @Body() updatedComment: UpdatedComment) {
    return this.commentsService.update(Number(newsId), Number(id), updatedComment);
  }

  @Delete(':newsId/:id')
  remove(@Param('newsId') newsId: string, @Param('id') id: string) {
    return this.commentsService.remove(Number(newsId), Number(id));
  }
}
