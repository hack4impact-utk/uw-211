'use client';

import { SyntheticEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SignInFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface IconProps extends React.HTMLAttributes<SVGElement> {}

const Icons = {
  microsoft: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="24px"
      width="24px"
      {...props}
    >
      <path
        d="M0 0h2311v2310H0zm2564 0h2311v2310H2564zM0 2564h2311v2311H0zm2564 0h2311v2311H2564"
        fill="currentColor"
        width="24"
      />
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

  async function onClick(event: SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

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
