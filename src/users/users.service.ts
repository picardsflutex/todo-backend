import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from 'src/dtos';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async createUser(dto: CreateUserDto){
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash: dto.password
      }
    })
    return user;
  }

  async getUserByField(field: { id?: number; email?: string; username?: string }): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: field,
    });
  } 

  async linkAccount(userId: number, provider: string, providerAccountId: string) {
    return this.prisma.account.create({
      data: {
        userId,
        provider,
        providerAccountId,
      },
    });
  }

async getAccountByProviderAndAccountId(provider: string, providerAccountId: string) {
  return this.prisma.account.findFirst({
    where: { provider, providerAccountId },
  });
}
}
