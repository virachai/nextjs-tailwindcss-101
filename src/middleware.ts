import createMiddleware from 'next-intl/middleware';

import { routing } from './features/i18n/infrastructure/config/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(th|en)/:path*'],
};
