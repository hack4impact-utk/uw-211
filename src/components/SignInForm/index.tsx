'use client';

import { HTMLAttributes, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Spinner from '@/components/Spinner';

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
};

export default function SignInForm({ className }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function attemptAuth() {
    setIsLoading(true);
    signIn('azure-ad');
    router.push('/dashboard');

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className={cn('grid gap-6', className)}>
      <Button
        type="button"
        variant="outline"
        onClick={attemptAuth}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            <Icons.microsoft className="mr-2 h-4 w-4" /> Sign in with Microsoft
          </>
        )}
      </Button>
    </div>
  );
}
