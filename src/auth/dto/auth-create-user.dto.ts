import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class AuthCreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(3, 25)
  username: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 25)
  password: string
}