import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import * as mongoose from 'mongoose';
import {User} from "../../auth/entities/user.entity";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {

  @Prop()
  text: string

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  messageAuthor: User
}

export const MessageSchema = SchemaFactory.createForClass(Message);