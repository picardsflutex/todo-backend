import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/dtos';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async getUserProjects(userId: number) {
    return this.prisma.project.findMany({
      where: {
        ProjectParticipant: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        ProjectParticipant: true,
      },
    });
  }

  async createProject(data: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        ...data,
        
        ProjectParticipant: {
          create: {
            userId: userId,
            project_role: 'AUTHOR',
          },
        },
      },
      include: {
        ProjectParticipant: true,
      },
    });
  }


  async updateProject(id: number, data: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: number) {
    return this.prisma.project.update({
      where: { id },
      data:{
        status: "DELETED"
      },
    });
  }
}
