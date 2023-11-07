'use client';

import { HTMLAttributes, SyntheticEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SignInFormProps extends HTMLAttributes<HTMLDivElement> {}
interface IconProps extends HTMLAttributes<SVGElement> {}

const Icons = {
  microsoft: (props: IconProps) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M 0 0 L 11.377 0 L 11.377 11.372 L 0 11.372 L 0 0 Z"
        transform="matrix(1, 0, 0, 1, 0, 8.881784197001252e-16)"
      ></path>
      <path
        d="M 12.623 12.623 L 24 12.623 L 24 24 L 12.623 24"
        transform="matrix(1, 0, 0, 1, 0, 8.881784197001252e-16)"
      ></path>
      <path
        d="M 0 12.623 L 11.377 12.623 L 11.377 24 L 0 24 L 0 12.623 Z"
        transform="matrix(1, 0, 0, 1, 0, 8.881784197001252e-16)"
      ></path>
      <path
        d="M 12.623 0 L 24 0 L 24 11.372 L 12.623 11.372 L 12.623 0 Z"
        transform="matrix(1, 0, 0, 1, 0, 8.881784197001252e-16)"
      ></path>
    </svg>
  ),
  spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

export default function SignInForm({ className, ...props }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function onClick(event: SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    // Implement authentication here...
    const auth = true; // isAuthenticated();
    if (auth) {
      setIsLoading(false);
      router.push('/dashboard');
    }
    // else, redirect to 2FA

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Button variant="outline" onClick={onClick} disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.microsoft className="mr-2 h-4 w-4" />
        )}{' '}
        Sign in with Microsoft
      </Button>
    </div>
  );
}
