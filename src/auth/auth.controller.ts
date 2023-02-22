import {Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {AuthCreateUserDto} from "./dto/auth-create-user.dto";
import {Tokens} from "./types/tokens.types";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AuthGuard} from "@nestjs/passport";
import {Request} from 'express'
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {RefreshTokenGuard} from "../common/guards/refresh-token-guard";
import {GetCurrentUser} from "../common/decorators/get-current-user.decorator";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authCreateUserDto: AuthCreateUserDto): Promise<Tokens> {
    return this.authService.register(authCreateUserDto)
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(authLoginDto)
  }

  @Post('/logout')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    console.log(userId)
    return this.authService.logout(userId)
  }

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken)
  }

}
