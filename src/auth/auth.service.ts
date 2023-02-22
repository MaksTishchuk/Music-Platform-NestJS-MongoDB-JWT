import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./entities/user.entity";
import {AuthCreateUserDto} from "./dto/auth-create-user.dto";
import * as bcrypt from 'bcrypt'
import {Tokens} from "./types/tokens.types";
import {JwtService} from "@nestjs/jwt";
import {AuthLoginDto} from "./dto/auth-login.dto";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async register(authCreateUserDto: AuthCreateUserDto): Promise<Tokens> {
    const {email, username, password} = authCreateUserDto
    const user = await this.userModel.findOne({email: email})
    if (user) throw new HttpException('User with this credentials already exists!', HttpStatus.BAD_REQUEST)
    const hashPassword = await this.hashData(password)
    const newUser = await this.userModel.create({
      username: username,
      email: email,
      password: hashPassword
    })
    const tokens = await this.generateTokens(newUser.id, newUser.email, newUser.username)
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken)
    return tokens
  }

  async login(authLoginDto: AuthLoginDto): Promise<Tokens> {
    const {email, password} = authLoginDto
    const user = await this.userModel.findOne({email: email})
    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!user || !passwordMatches) throw new HttpException('User with this credentials was not found!', HttpStatus.NOT_FOUND)
    const tokens = await this.generateTokens(user.id, user.email, user.username)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }

  async logout(userId: string) {
    await this.userModel.updateMany(
      {
        _id: userId,
        hashedRefreshToken: {$ne: null}
      },
      {
        hashedRefreshToken: null
      }
    )
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findOne({id: userId})
    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken)
    if (!user || !user.hashedRefreshToken || !refreshTokenMatches) throw new HttpException('Access denied!', HttpStatus.FORBIDDEN)
    const tokens = await this.generateTokens(user.id, user.email, user.username)
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken)
    return tokens
  }


  async getUserById(userId: string) {
    const user = await this.userModel.findOne({_id: userId})
    return user
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken)
    await this.userModel.updateOne({_id: userId}, {hashedRefreshToken: hash})
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async generateTokens(userId: string, email:string, username: string): Promise<Tokens> {
    const accessToken = await this.jwtService.signAsync(
      {
        userId, email, username
      },
      {
        secret: 'maks-access-secret-key',
        expiresIn: 60 * 120
      }
    )

    const refreshToken = await this.jwtService.signAsync(
      {
        userId, email, username
      },
      {
        secret: 'maks-refresh-secret-key',
        expiresIn: 60 * 60 * 24 * 7
      }
    )
    return {accessToken, refreshToken}
  }
}
