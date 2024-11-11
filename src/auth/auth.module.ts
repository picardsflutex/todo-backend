import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, UsersService, PrismaService, AtStrategy, RtStrategy, ConfigService],
  controllers: [AuthController],
})
export class AuthModule {}
