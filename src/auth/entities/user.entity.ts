import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as mongoose from 'mongoose';
import {Track} from "../../track/entities/track.entity";
import {Comment} from "../../track/entities/comment.entity";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop()
  hashedRefreshToken: string

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
  tracks: Track[]

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]
}

export const UserSchema = SchemaFactory.createForClass(User);