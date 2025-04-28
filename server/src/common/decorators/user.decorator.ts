import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserModel } from 'src/user/models/user.model';

export const User = createParamDecorator<never, UserModel | undefined>(
  (_data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;

    return user;
  },
);
