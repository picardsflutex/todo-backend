import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto, UpdateTaskDto } from 'src/dtos';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getProjectTasks(projectId: number) {
    return this.prisma.task.findMany({
      where: {
        projectId: projectId,
      },
    });
  }

  async createTask(data: CreateTaskDto) {
    return this.prisma.task.create({ data });
  }

  async updateTask(id: number, data: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: number) {
    return this.prisma.task.update({
      where: { id },
      data:{
        status: "DELETED"
      },
    });
  }
}
