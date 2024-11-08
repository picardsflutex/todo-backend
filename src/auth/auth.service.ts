import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, CreateUserDto } from 'src/dtos';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtPayload, Tokens } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Tokens>{
    const password_hash = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password_hash: password_hash,
        name: dto.username
      }
    })

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role)

    return tokens;
  }

  async signin(dto: AuthDto): Promise<Tokens>{
    const user = await this.prisma.user.findUnique({ where: {email: dto.email} })
    if (!user) throw new ForbiddenException("Access Denied")

    const passwordMatches = await bcrypt.compare(dto.password, user.password_hash)
    if (!passwordMatches) throw new ForbiddenException("Access Denied")

    const tokens = await this.getTokens(user.id, user.email, user.role)

    return tokens;
  }

  async refresh(rt: string): Promise<Tokens>{
    const { id } = this.jwtService.verify(rt,{secret: this.config.get<string>('RT_SECRET')})

    const user = await this.prisma.user.findUnique({ where: { id, } });
    if (!user || !rt) throw new ForbiddenException('Access Denied');

    return this.getTokens(user.id, user.email, user.role);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(userId: number, email: string, role: Role): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      id: userId,
      email: email,
      role: role
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
