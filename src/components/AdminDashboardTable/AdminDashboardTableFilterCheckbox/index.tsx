'use client';

import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { DashboardParams } from '@/utils/types';
import { useRouter } from 'next/navigation';

type AdminDashboardTableFilterCheckboxProps = {
  searchParams: DashboardParams;
  initialCompleted: boolean;
  initialNeedsReview: boolean;
  initialExpired: boolean;
};

export function AdminDashboardTableFilterCheckbox({
  searchParams,
  initialCompleted,
  initialNeedsReview,
  initialExpired,
}: AdminDashboardTableFilterCheckboxProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    completed: initialCompleted,
    needsReview: initialNeedsReview,
    expired: initialExpired,
  });

  const createQueryString = useCallback(
    (
      filters: Record<string, boolean>,
      searchParamsObject: Record<string, string>
    ) => {
      const searchParams = new URLSearchParams(searchParamsObject);

      searchParams.set('completed', filters.completed ? 'true' : 'false');
      searchParams.set('needsReview', filters.needsReview ? 'true' : 'false');
      searchParams.set('expired', filters.expired ? 'true' : 'false');

      return searchParams.toString();
    },
    []
  );

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    router.replace(
      '/dashboard' + '?' + createQueryString(filters, searchParams)
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          key={'completed'}
          checked={filters.completed}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, completed: !prev.completed }));
          }}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key={'needsReview'}
          checked={filters.needsReview}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, needsReview: !prev.needsReview }));
          }}
        >
          Needs Review
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key={'expired'}
          checked={filters.expired}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, expired: !prev.expired }));
          }}
        >
          Expired
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <button
          onClick={handleSubmit}
          className="mx-1 my-1 rounded-md bg-blue-500 px-2 py-1 font-semibold text-white  hover:bg-blue-700"
        >
          Filter
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
