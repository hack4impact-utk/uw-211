import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from '@/i18n';

export default createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en-US|es-US)/:path*'],
};
