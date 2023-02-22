import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 25)
  password: string
}