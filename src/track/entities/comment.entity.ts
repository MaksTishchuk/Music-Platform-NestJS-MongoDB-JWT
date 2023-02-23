import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import {Track} from "./track.entity";
import {User} from "../../auth/entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {

  @ApiProperty({ description: 'Text of comment', example: 'Its my comment' })
  @Prop()
  text: string

  @ApiProperty({ description: 'Created at', example: 'Date of create' })
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'Track Id', example: 'Id of track' })
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Track'})
  track: Track

  @ApiProperty({ description: 'Author Id', example: 'Id of author' })
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  author: User
}

export const CommentSchema = SchemaFactory.createForClass(Comment);