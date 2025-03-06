import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './message.service';

@WebSocketGateway({ transport: ['websocket'] })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly messagesService: MessagesService) {}

  private logger: Logger = new Logger('MessageGateway');

  @WebSocketServer() wss: Server;

  afterInit(server: Server): void {
    this.logger.log('Initialized');
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client Connected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: string): Promise<void> {
    const newMessage = await this.messagesService.createMessage(payload);
    this.wss.emit('receiveMessage', newMessage);
  }
}
