import { Logger, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';
import { CommentEvents } from 'src/utils/Events.enum';
import { CommentService } from './comment.service';

export type Comment = { message: string, newsId: number; };

@WebSocketGateway()
export class SocketCommentGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('AppGateway');

  constructor(
    private readonly commentService: CommentService
  ) { }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleMessage(client: Socket, comment: Comment) {
    const { newsId, message } = comment;
    const userId: number = client.data.user.id;
    const _comment = await this.commentService.create(newsId, message, userId);
    this.server.to(newsId.toString()).emit('newComment', _comment);
  }

  @OnEvent(CommentEvents.remove)
  handleRemoveCommentEvent(payload: { commentId: number, newsId: number; }) {
    const { commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  @OnEvent(CommentEvents.edit)
  handleEditCommentEvent(payload: { newsId: number, comment: Comment; }) {
    const { newsId, comment } = payload;
    this.server.to(newsId.toString()).emit('editComment', { comment });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const { newsId } = client.handshake.query;
    client.join(newsId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}