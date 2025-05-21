import { SetMetadata } from '@nestjs/common';

import { PUBLIC_DECORATOR_KEY } from '../constants';

/**
 * @note DO NOT use together with `@isSeller`
 */
export const Public = () => SetMetadata(PUBLIC_DECORATOR_KEY, true);
