import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as mongoose from 'mongoose';
import {Track} from "../../track/entities/track.entity";
import {Comment} from "../../track/entities/comment.entity";
import {ApiProperty} from "@nestjs/swagger";
import {Message} from "../../messages/entities/message.entity";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @ApiProperty({ description: 'Username', example: 'Maks' })
  @Prop({ required: true, unique: true })
  username: string

  @ApiProperty({ description: 'Email', example: 'maks@gmail.com' })
  @Prop({ required: true, unique: true })
  email: string

  @ApiProperty({ description: 'Password hash', example: 'UserPassword' })
  @Prop({ required: true })
  password: string

  @ApiProperty({ description: 'Refresh token hash', example: 'hashedRefreshToken' })
  @Prop()
  hashedRefreshToken: string

  @ApiProperty({ description: 'Created at', example: 'Date of create' })
  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @ApiProperty({ description: 'User tracks', example: ['User tracks'] })
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Track'}]})
  tracks: Track[]

  @ApiProperty({ description: 'User comments', example: ['User comments'] })
  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]})
  messages: Message[]
}

export const UserSchema = SchemaFactory.createForClass(User);