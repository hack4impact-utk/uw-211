'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type AdminDashboardTablePaginationControlsProps = {
  numAgencies: number;
  count: number;
  page: number;
  setCount: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export default function AdminDashboardTablePaginationControls({
  numAgencies,
  count,
  page,
  setCount,
  setPage,
}: AdminDashboardTablePaginationControlsProps) {
  const handleCountChange = (value: string) => {
    const count = parseInt(value);
    setCount(count);
  };

  const handleChangePage = (delta: number) => {
    const newPage = page + delta;
    setPage(newPage);
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
