import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { Public, Roles } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { RoleGuard } from 'src/common/guards/role.guard';

@Controller('users')
export class UsersController {

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return 'This action adds a new cat';
  }

  @UseGuards(AtGuard)
  @Get('/user')
  findOne() {
    return 'This action returns all cats';
  }

  @Public()
  @Get('/userpublic')
  findOneP() {
    return 'This action returns all cats';
  }

  @Roles('USER')
  @UseGuards(RoleGuard)
  @Get('/userrole')
  findOneR() {
    return 'This action returns all cats';
  }
}
