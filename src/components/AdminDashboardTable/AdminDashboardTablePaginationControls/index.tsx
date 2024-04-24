'use client';

import { Button } from '@/components/ui/button';
import { DashboardParams } from '@/utils/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AdminDashboardTablePaginationControlsProps = {
  searchParams: DashboardParams;
  numAgencies: number;
};

export default function AdminDashboardTablePaginationControls({
  searchParams,
  numAgencies,
}: AdminDashboardTablePaginationControlsProps) {
  const [count, setCount] = useState(
    searchParams.count ? parseInt(searchParams.count) : 10
  );
  const [page, setPage] = useState(
    searchParams.page ? parseInt(searchParams.page) : 1
  );
  const router = useRouter();

  const handleCountChange = (value: string) => {
    const count = parseInt(value);
    setCount(count);

    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set('count', count.toString());

    router.replace('/dashboard' + '?' + urlSearchParams.toString());
  };

  const handleChangePage = (delta: number) => {
    const newPage = page + delta;
    setPage(newPage);

    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set('page', newPage.toString());

    router.replace('/dashboard' + '?' + urlSearchParams.toString());
  };

  return (
    <div className="flex gap-2">
      <Select onValueChange={handleCountChange} defaultValue={count.toString()}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">Show 10 items</SelectItem>
          <SelectItem value="25">Show 25 items</SelectItem>
          <SelectItem value="50">Show 50 items</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        disabled={page.toString() === '1'}
        onClick={() => handleChangePage(-1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={(page - 1) * count + count >= numAgencies}
        onClick={() => handleChangePage(1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
