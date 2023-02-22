import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import {Track} from "./track.entity";
import {User} from "../../auth/entities/user.entity";

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  text: string

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Track'})
  track: Track

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  author: User
}

export const CommentSchema = SchemaFactory.createForClass(Comment);