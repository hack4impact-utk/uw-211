import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, localePrefix } from '@/i18n';

const privatePages = ['/dashboard'];

const intlMiddleware = createIntlMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: localePrefix,
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/signin',
    },
  }
);

export default function middleware(req: NextRequest) {
  const privatePathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${privatePages
      .flatMap((p) => p)
      .join('|')})/?$`,
    'i'
  );
  const isPrivatePage = privatePathnameRegex.test(req.nextUrl.pathname);

  if (isPrivatePage) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (authMiddleware as any)(req);
  } else {
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
