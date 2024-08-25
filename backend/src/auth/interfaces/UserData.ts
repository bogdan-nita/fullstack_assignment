import { User } from '@prisma/client';

export interface UserData {
  id: User['id'];
  name: User['name'];
  email: User['email'];
}
