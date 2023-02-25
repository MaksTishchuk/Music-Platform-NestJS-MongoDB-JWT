import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import {Server, Socket} from "socket.io";

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class MessagesGateway {

  @WebSocketServer()
  server: Server

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket
  ) {
    return this.messagesService.joinRoom(userId, client.id)
  }

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket
  ) {
    const message = await this.messagesService.create(createMessageDto, client.id)
    if (message) {
      this.server.emit('message', message)
      return message
    }
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    return await this.messagesService.findAll()
  }


  @SubscribeMessage('typingDisplay')
  async typingDisplay(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket
  ) {
    const username = await this.messagesService.getClientName(client.id)
    client.broadcast.emit('typing', {username, isTyping})
  }
}
