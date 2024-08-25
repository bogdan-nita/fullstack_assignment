import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../services';
import { LocalGuard } from '../guards';
import { LoginDto } from '../dtos';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalGuard)
  async login(
    @Body() { email, password }: LoginDto,
    @Res() response: Response,
  ) {
    const auth = await this.authService.login(email, password);
    response.cookie('jwt', auth.token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    return response.status(200).json(auth.user);
  }
}
