'use client';

import { Input } from '@/components/ui/input';
import { DashboardParams } from '@/utils/types';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AdminDashboardTableSearchProps = {
  searchParams: DashboardParams;
};

export default function AdminDashboardTableSearch({
  searchParams,
}: AdminDashboardTableSearchProps) {
  const [search, setSearch] = useState(searchParams.search || '');
  const router = useRouter();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set('search', search);

    router.replace('/dashboard' + '?' + urlSearchParams.toString());
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(event);
    }
  };

  return (
    <form className="flex flex-1 items-center" onSubmit={handleSearch}>
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
      >
        <Search />
      </button>
    </form>
  );
}
