import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InvalidCredentialsException } from '../errors';
import { JwtPayload, UserData } from '../interfaces';
import { PrismaService } from '../../prisma';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validate(email: string, password: string): Promise<UserData> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
      //
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async createToken(user: UserData): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };
    return this.jwt.sign(payload);
  }

  async login(email: string, password: string) {
    const user = await this.validate(email, password);
    const token = await this.createToken(user);

    return { token, user };
  }
}
