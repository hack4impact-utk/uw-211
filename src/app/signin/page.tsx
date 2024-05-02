import Link from 'next/link';
import SignInForm from '@/components/SignInForm';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function SignIn() {
  const session = await getServerSession(options);

  if (session && session.user) {
    redirect('/dashboard');
  }

  return (
    <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
      {/* Left side of signin page. Visible on >= lg screen sizes*/}
      <div className="relative hidden h-full flex-col items-center justify-center lg:flex">
        <div className="w-full flex-1"></div>
        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="inline-block">
            <Link
              href="https://www.211.org/"
              target="_blank"
              className="flex items-center text-lg font-medium"
            >
              <Image
                src="/img/unitedway211.png"
                alt="United Way 211"
                width={290}
                height={290}
              />
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </Link>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col">
          <blockquote className="mt-auto space-y-2 p-8">
            <p className="text-lg text-black">
              &ldquo;United Way of Greater Knoxville is driving change in our
              community by uniting people, businesses, and organizations.
              Together, we&apos;re creating a more equitable Knoxville where we
              have stable housing, financial security, quality early care and
              education, access to food, and more.{' '}
              <b>Join us and answer the call.</b>&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      {/* Right side */}
      <div className="flex items-center justify-center overflow-x-auto bg-[#0055A7]">
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Sign in
              </h1>
            </div>
            <SignInForm />
            <p className="px-8 text-center text-sm text-[#cccccc]">
              By clicking continue, you agree to our{' '}
              <Link
                href="https://uwgk.org/wpautoterms/terms-and-conditions/"
                target="_blank"
                aria-label="Terms of Service"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="https://uwgk.org/wpautoterms/privacy-policy/"
                target="_blank"
                aria-label="Privacy Policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
