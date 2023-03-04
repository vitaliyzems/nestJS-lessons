import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    // Изменение названия поля username по умолчанию на email
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const userEntity = await this.authService.validateUser(email, password);

    if (!userEntity) {
      throw new UnauthorizedException();
    }

    const user = {
      ...userEntity,
    };

    return user;
  }
}