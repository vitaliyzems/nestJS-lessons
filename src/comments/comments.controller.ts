import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './dto/create-comment.dto';
import { UpdatedComment } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Get(':newsId')
  get(@Param('newsId') newsId: string): Comment[] {
    return this.commentsService.find(Number(newsId));
  }

  @Post(':newsId')
  create(@Param('newsId') newsId: string, @Body() comment: Comment): Comment {
    return this.commentsService.create(Number(newsId), comment);
  };

  @Post(':newsId/:id')
  reply(@Param('newsId') newsId: string, @Body() comment: Comment, @Param('id') id: string) {
    return this.commentsService.create(Number(newsId), comment, Number(id));
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
