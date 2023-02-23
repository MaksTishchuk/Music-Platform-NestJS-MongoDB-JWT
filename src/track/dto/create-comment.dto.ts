import {ObjectId} from "mongoose";
import {IsNotEmpty, IsString, Length} from "class-validator";

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 1000)
  readonly text: string

  @IsNotEmpty()
  readonly trackId: ObjectId
}