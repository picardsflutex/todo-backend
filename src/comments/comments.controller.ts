import { Controller, Post, Body, Patch, Delete, Param, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto, CreateCommentDto } from 'src/dtos';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('task/:taskId')
  getTaskComments(@Param('taskId') taskId: string) {
    return this.commentsService.getTaskComments(+taskId);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.createComment(createCommentDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateCommentDto) {
    return this.commentsService.updateComment(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.deleteComment(+id);
  }
}
