import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as mongoose from 'mongoose';
import {Comment} from "./comment.entity";
import {User} from "../../auth/entities/user.entity";
import {ApiProperty} from "@nestjs/swagger";

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {

  @ApiProperty({ description: 'Name of track', example: 'Moonlight sonata' })
  @Prop()
  name: string

  @ApiProperty({ description: 'Name of artist', example: 'Beethoven' })
  @Prop()
  artist: string

  @ApiProperty({ description: 'Text of track', example: 'Track text' })
  @Prop()
  text: string

  @ApiProperty({ description: 'Number of listens', example: 333 })
  @Prop()
  listens: number

  @ApiProperty({ description: 'Path of track picture', example: 'picture/picture.jpg' })
  @Prop()
  picture: string

  @ApiProperty({ description: 'Path of track audio', example: 'audio/audio.mp3' })
  @Prop()
  audio: string

  @ApiProperty({ description: 'Created at', example: 'Date of create' })
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'Track comments', example: ['Track Comments'] })
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  @ApiProperty({ description: 'User who added track', example: 'user Id' })
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  addedTrack: User
}

export const TrackSchema = SchemaFactory.createForClass(Track);