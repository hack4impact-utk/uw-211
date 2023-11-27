'use client';

import WelcomePage from '@/components/WelcomePage/Index';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? 'Participant';

  return (
    <>
      <WelcomePage id={id}></WelcomePage>
    </>
  );
}
