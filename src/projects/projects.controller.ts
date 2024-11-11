import { Controller, Post, Body, Param, Patch, Delete, Get, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from 'src/dtos';
import { AtGuard, RtGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('user')
  @UseGuards(AtGuard)
  getUserProjects(@GetCurrentUserId() userId: number) {
    return this.projectsService.getUserProjects(userId);
  }

  @Get('user/:userId')
  getUserIdProjects(@Param('userId') userId: string) {
    return this.projectsService.getUserProjects(+userId);
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.deleteProject(+id);
  }
}
