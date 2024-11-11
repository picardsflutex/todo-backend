import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, CreateUserDto } from 'src/dtos';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt'
import { JwtPayload, Tokens } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UsersService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Tokens>{
    const email = await this.userService.getUserByField({email: dto.email});
    const name = await this.userService.getUserByField({name: dto.username});
    if(email || name) throw new ForbiddenException("Email or username already in use.")

    dto.password = await this.hashData(dto.password);

    const newUser = await this.userService.createUser(dto);

    const tokens = await this.getTokens(newUser.id, newUser.email, newUser.role)

    return tokens;
  }

  async signin(dto: AuthDto): Promise<Tokens>{
    const user = await this.userService.getUserByField({email: dto.email});
    if (!user) throw new ForbiddenException("User not found.")

    const passwordMatches = await bcrypt.compare(dto.password, user.password_hash)
    if (!passwordMatches) throw new ForbiddenException("Uncorrect password.")

    const tokens = await this.getTokens(user.id, user.email, user.role)

    return tokens;
  }

  async refresh(id: number): Promise<Tokens>{
    const user = await this.userService.getUserByField({id});
    if (!user || !id) throw new ForbiddenException('User not found.');

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
