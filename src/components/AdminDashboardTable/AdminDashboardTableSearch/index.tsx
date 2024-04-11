'use client';

import { Input } from '@/components/ui/input';
import { DashboardParams } from '@/utils/types';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

type AdminDashboardTableSearchProps = {
  searchParams: DashboardParams;
};

export default function AdminDashboardTableSearch({
  searchParams,
}: AdminDashboardTableSearchProps) {
  const [search, setSearch] = useState(searchParams.search || '');
  const router = useRouter();

  const createQueryString = useCallback(
    (
      name: string,
      value: string,
      searchParamsObject: Record<string, string>
    ) => {
      const searchParams = new URLSearchParams(searchParamsObject);
      searchParams.set(name, value);

      return searchParams.toString();
    },
    []
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    router.replace(
      '/dashboard' + '?' + createQueryString('search', search, searchParams)
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  };

  return (
    <form className="flex flex-1 items-center" onSubmit={handleSubmit}>
      <Input
        placeholder="Search for an agency..."
        className="max-w w-1/3 rounded-r-none focus-visible:ring-blue-500"
        defaultValue={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="rounded-r-md border border-l-0 bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleSubmit}
      >
        <Search />
      </button>
    </form>
  );
}
