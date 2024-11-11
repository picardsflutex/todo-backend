import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto, UpdateCommentDto } from 'src/dtos';


@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getTaskComments(taskId: number) {
    return this.prisma.comment.findMany({
      where: {
        taskId: taskId,
      },
    });
  }

  async createComment(data: CreateCommentDto) {
    return this.prisma.comment.create({ data });
  }

  async updateComment(id: number, data: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data,
    });
  }

  async deleteComment(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
