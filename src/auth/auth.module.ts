import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./entities/user.entity";
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./strategies/refreshToken.strategy";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
