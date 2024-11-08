import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from 'src/dtos';
import { GetCurrentUser, GetCurrentUserId, Public, Roles } from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';


@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService){}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto:CreateUserDto){
    return this.authService.signup(dto)
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto:AuthDto){
    return this.authService.signin(dto)
  }
  
  @Public()
  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ){
    return this.authService.refresh(userId, refreshToken);
  }
}
