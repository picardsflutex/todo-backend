import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, CreateUserDto } from 'src/dtos';
import * as bcrypt from 'bcrypt'
import { JwtPayload, Tokens } from 'src/types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UsersService,
  ) {}

  async signup(dto: CreateUserDto): Promise<Tokens> {
    const emailExists = await this.userService.getUserByField({ email: dto.email });

    if (emailExists) throw new ForbiddenException('Email already in use.');

    dto.password = await this.hashData(dto.password);
    const newUser = await this.userService.createUser(dto);

    await this.userService.linkAccount(newUser.id, 'credentials', dto.email);

    const { password_hash, ...jwtPayload } = newUser;
    const tokens = await this.getTokens(jwtPayload);
    return tokens;
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const account = await this.userService.getAccountByProviderAndAccountId('credentials', dto.email);
    if (!account) throw new ForbiddenException('User not found.');

    const user = await this.userService.getUserByField({ id: account.userId });
    const passwordMatches = await bcrypt.compare(dto.password, user.password_hash);

    if (!passwordMatches) throw new ForbiddenException('Incorrect password.');

    const { password_hash, ...jwtPayload } = user;
    const tokens = await this.getTokens(jwtPayload);
    return tokens;
  }

  async oauthSignin(provider: string, providerAccountId: string, email: string): Promise<Tokens> {
    let user = await this.userService.getUserByField({ email });

    if (!user) {
      user = await this.userService.createUser({
        email,
        password: null,
      });
    }

    const account = await this.userService.getAccountByProviderAndAccountId(provider, providerAccountId);

    if (!account) {
      await this.userService.linkAccount(user.id, provider, providerAccountId);
    }

    const { password_hash, ...jwtPayload } = user;
    const tokens = await this.getTokens(jwtPayload);
    return tokens;
  }


  async refresh(id: number): Promise<Tokens>{
    const user = await this.userService.getUserByField({id});
    if (!user || !id) throw new ForbiddenException('User not found.');
    
    const { password_hash, ...jwtPayload } = user;
    return this.getTokens(jwtPayload);
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async getTokens(user: JwtPayload): Promise<Tokens> {

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(user, {
        secret: this.config.get<string>('AT_SECRET'),
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(user, {
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
