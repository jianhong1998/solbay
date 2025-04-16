import { Injectable } from '@nestjs/common';
import { UserDBUtil } from 'src/user/utils/userDB.util';

import { TokenUtil } from '../utils/token.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userDBUtil: UserDBUtil,
    private readonly tokenUtil: TokenUtil,
  ) {}
}
