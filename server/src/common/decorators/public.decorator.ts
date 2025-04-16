import { SetMetadata } from '@nestjs/common';

import { PUBLIC_DECORATOR_KEY } from '../constants';

export const Public = () => SetMetadata(PUBLIC_DECORATOR_KEY, true);
