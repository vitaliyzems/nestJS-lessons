import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractFromCookies
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  private static extractFromCookies(req: Request): string | null {
    return req.cookies && 'jwt' in req.cookies ? req.cookies.jwt : null;
  }

  async validate(payload: any) {
    return payload;
  }
}