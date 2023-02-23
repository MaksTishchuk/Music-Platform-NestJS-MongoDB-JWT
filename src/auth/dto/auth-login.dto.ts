import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AuthLoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'maks@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'Password',
    example: 'UserPassword',
  })
  @IsNotEmpty()
  @IsString()
  @Length(5, 25)
  password: string
}