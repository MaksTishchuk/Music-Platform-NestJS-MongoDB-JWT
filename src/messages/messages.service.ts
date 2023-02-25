import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../auth/entities/user.entity";
import {Model} from "mongoose";
import {Message, MessageDocument} from "./entities/message.entity";

@Injectable()
export class MessagesService {

  joinRoomClients = {}

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {}

  async joinRoom(userId: string, clientId: string) {
    const user = await this.userModel.findOne({_id: userId})
    this.joinRoomClients[clientId] = user.username
    return Object.values(this.joinRoomClients)
  }

  getClientName(clientId: string) {
    return this.joinRoomClients[clientId]
  }

  async create(createMessageDto: CreateMessageDto, clientId: string) {
    const username = this.getClientName(clientId)
    if (username) {
      const user = await this.userModel.findOne({username: username})
      const message = await this.messageModel.create({
        text: createMessageDto.text, messageAuthor: user.id
      })
      user.messages.push(message.id)
      await user.save()
      return message.populate('messageAuthor', '_id username email')
    }
  }

  async findAll() {
    const messages = await this.messageModel.find().populate('messageAuthor', '_id username email')
    return messages
  }

}
