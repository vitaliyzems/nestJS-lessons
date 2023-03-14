import { CanActivate, ExecutionContext, Injectable, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) { }

  async canActivate(context: ExecutionContext) {
    try {
      const client = context.switchToWs().getClient();
      const cookie = client.handshake.headers.cookie;
      const value = `; ${cookie}`;
      const parts = value.split(`; jwt=`);
      const authToken = parts.pop().split(';').shift();

      const isAuth = await this.authService.verify(authToken);
      if (isAuth) {
        const user = await this.authService.decode(authToken);
        context.switchToWs().getClient().data.user = user;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}