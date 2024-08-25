import { Request } from 'express';
import { UserData } from './UserData';

export interface AuthenticatedRequest extends Request {
  user: UserData;
}
