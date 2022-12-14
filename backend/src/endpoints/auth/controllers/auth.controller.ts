import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from 'src/endpoints/user/dtos/create-user.dto';
import AuthenticationGuard from '../guards/authentication.guard';
import LocalAuthGuard from '../guards/local.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) {
    const expires = req.session.cookie._expires;
    const { user } = req.session.passport;
    return { user, expires };
  }
  @Get('status')
  @UseGuards(AuthenticationGuard)
  async status(@Req() req) {
    return req.user;
  }
  @Post('registration')
  async registration(@Body() body: CreateUserDTO) {
    return this.authService.registration(body);
  }
  @Get('logout')
  @UseGuards(AuthenticationGuard)
  async logout(@Req() req) {
    req.logout();
    return { message: 'logout' };
  }
}
