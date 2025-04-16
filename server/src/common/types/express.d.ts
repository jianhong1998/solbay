import { UserModel } from 'src/user/models/user.model';

declare module 'express' {
  interface Request {
    user?: UserModel;
  }
}
