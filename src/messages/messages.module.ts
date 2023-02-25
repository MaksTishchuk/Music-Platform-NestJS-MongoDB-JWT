import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../auth/entities/user.entity";
import {AuthModule} from "../auth/auth.module";
import {Message, MessageSchema} from "./entities/message.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Message.name, schema: MessageSchema}
    ]),
    AuthModule
  ],
  providers: [MessagesGateway, MessagesService]
})
export class MessagesModule {}
