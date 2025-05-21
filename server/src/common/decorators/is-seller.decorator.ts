import { SetMetadata } from '@nestjs/common';

import { IS_SELLER_DECORATOR_KEY } from '../constants';

/**
 * @note DO NOT use together with `@isPublic`
 */
export const IsSeller = () => SetMetadata(IS_SELLER_DECORATOR_KEY, true);
