import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserModel } from 'src/user/models/user.model';

export const User = createParamDecorator(
  (context: ExecutionContext): UserModel => {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;

    return user;
  },
);
