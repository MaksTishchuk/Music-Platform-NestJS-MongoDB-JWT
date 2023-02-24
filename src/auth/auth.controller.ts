import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from "express";
import {AuthService} from "./auth.service";
import {AuthCreateUserDto} from "./dto/auth-create-user.dto";
import {Tokens} from "./types/tokens.types";
import {AuthLoginDto} from "./dto/auth-login.dto";
import {AccessTokenGuard} from "../common/guards/access-token-guard";
import {RefreshTokenGuard} from "../common/guards/refresh-token-guard";
import {GetCurrentUser} from "../common/decorators/get-current-user.decorator";
import {GetCurrentUserId} from "../common/decorators/get-current-user-id.decorator";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags
} from "@nestjs/swagger";
import {GoogleAuthGuard} from "../common/guards/google-auth-guard";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Created user with access and refresh tokens as response'
  })
  @ApiBadRequestResponse({ description: 'User cannot register. Try again!' })
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authCreateUserDto: AuthCreateUserDto): Promise<Tokens> {
    return this.authService.register(authCreateUserDto)
  }

  @Post('/login')
  @ApiOkResponse({
    description: 'Login user with access and refresh tokens as response'
  })
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto): Promise<Tokens> {
    return this.authService.login(authLoginDto)
  }

  @Post('/logout')
  @ApiOkResponse({
    description: 'Logout user'
  })
  @ApiSecurity('bearer')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId)
  }

  @Post('/refresh')
  @ApiOkResponse({
    description: 'Refresh tokens with access and refresh tokens as response'
  })
  @ApiSecurity('bearer')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken)
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() request: Request) {
    return this.authService.googleAuth(request.user)
  }
}
