import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as mongoose from 'mongoose';
import {Comment} from "./comment.entity";
import {User} from "../../auth/entities/user.entity";

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @Prop()
  name: string

  @Prop()
  artist: string

  @Prop()
  text: string

  @Prop()
  listens: number

  @Prop()
  picture: string

  @Prop()
  audio: string

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  addedTrack: User
}

export const TrackSchema = SchemaFactory.createForClass(Track);