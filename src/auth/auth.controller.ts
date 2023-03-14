import { Controller, Get, Post, Render, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: User; }, @Res({ passthrough: true }) res: Response) {
    const { id, access_token } = await this.authService.login(req.user);
    res.cookie('jwt', access_token, { 'httpOnly': true });
    res.cookie('id', id);
    res.cookie('role', req.user.role);
    return access_token;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('views/login')
  @Render('auth/login')
  getLoginView() {
    return { layout: 'auth', title: 'Авторизация' };
  }
}
