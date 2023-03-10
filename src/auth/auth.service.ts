import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { compare } from '../utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const _user = await this.usersService.findByEmail(email);

    if (_user && (await compare(pass, _user.password))) {
      const { password, ...result } = _user;
      return result;
    }

    return null;
  }

  async login(user: Omit<User, 'password'>) {
    return {
      id: user.id,
      access_token: this.jwtService.sign(user)
    };
  }

  async verify(token: string) {
    return this.jwtService.verify(token);
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}