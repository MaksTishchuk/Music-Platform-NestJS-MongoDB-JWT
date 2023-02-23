import {ObjectId} from "mongoose";
import {IsNotEmpty, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateCommentDto {

  @ApiProperty({
    description: 'Comment text',
    example: 'This is comment text',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  readonly text: string

  @ApiProperty({
    description: 'Track id to add comment',
    example: '6rew3424dd3432',
  })
  @IsNotEmpty()
  readonly trackId: ObjectId
}