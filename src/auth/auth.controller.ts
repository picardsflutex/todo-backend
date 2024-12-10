import { Body, Controller, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from 'src/dtos';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { Response } from 'express';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto
) {
    const tokens = await this.authService.signup(dto);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return tokens;
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.signin(dto);

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    return tokens;
  }

  @Public()
  @Post('/oauth/:provider')
  @HttpCode(HttpStatus.OK)
  async oauthSignin(
    @Param('provider') provider: string,
    @Body() dto: { providerAccountId: string; email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.oauthSignin(provider, dto.providerAccountId, dto.email);

    return tokens;
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserId() id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const tokens = await this.authService.refresh(id);

    return tokens;
  }

}
