import { Controller, Get, Post, Patch, Param, Delete, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const COMMENT_PATH = '/static/';
const helperFileLoader = new HelperFileLoader();
helperFileLoader.set(COMMENT_PATH);

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) { }

  @Post('')
  async create(
    @Body() dto: CreateCommentDto
  ): Promise<Comment> {
    return this.commentService.create(+dto.newsId, dto.message, +dto.userId);
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
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentService.update(Number(id), updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<Comment> {
    return this.commentService.remove(+id);
  }
}
