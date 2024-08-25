import { User } from '@prisma/client';
import { UserData } from './UserData';

export interface JwtPayload extends Omit<UserData, 'id'> {
  sub: User['id'];
  iat?: number;
  exp?: number;
}
