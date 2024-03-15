import Link from 'next/link';
import SignInForm from '@/components/SignInForm';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import useTranslation from 'next-translate/useTranslation';

export default async function SignIn() {
  const session = await getServerSession(options);
  const { t } = useTranslation('common');
  const disclaimer = t('signin.disclaimer', { link: 'xxxx' }).split('xxxx');

  if (session && session.user) {
    redirect('/dashboard');
  }

  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side of signin page. Only visible on >=lg responsive breakpoints. */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-sky-800" />
          <Link
            href="/"
            className="relative z-20 flex items-center text-lg font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            United Way Knoxville 211
          </Link>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">{t('signin.missionStatement')}</p>
            </blockquote>
          </div>
        </div>
        {/* Right half of signin page. Visible at all times and contains signin form. */}
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('signin.title')}
              </h1>
            </div>
            <SignInForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              {disclaimer[0]}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('signin.termsOfService')}
              </Link>{' '}
              {disclaimer[1]}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                {t('signin.privacyPolicy')}
              </Link>
              {disclaimer[2]}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
